import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import {
  createPasskey,
  createProviderUser,
  createUser,
  findPasskeyByCredentialId,
  findPasskeysByUserId,
  findUserByEmail,
  findUserById,
  findUserByProvider,
  linkProviderToUser,
  updatePasskeyCounter,
} from "../models/User.js";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

const googleClient = new OAuth2Client();
const passkeyRegistrationChallenges = new Map();
const passkeyLoginChallenges = new Map();

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function providerNotConfigured(providerName) {
  const error = new Error(`${providerName} login is not configured yet.`);
  error.status = 503;
  return error;
}

function webAuthnConfig() {
  const firstOrigin = (process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0].trim();
  return {
    rpName: process.env.WEBAUTHN_RP_NAME || "FreshMart",
    rpID: process.env.WEBAUTHN_RP_ID || new URL(firstOrigin).hostname,
    origins: (process.env.WEBAUTHN_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim()),
  };
}

function bytesToBase64Url(bytes) {
  return Buffer.from(bytes).toString("base64url");
}

function base64UrlToBytes(value) {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

function parseTransports(value) {
  try {
    return value ? JSON.parse(value) : [];
  } catch (_error) {
    return [];
  }
}

function credentialFromRow(passkey) {
  return {
    id: passkey.credential_id,
    publicKey: base64UrlToBytes(passkey.public_key),
    counter: Number(passkey.counter || 0),
    transports: parseTransports(passkey.transports),
  };
}

async function sessionForProviderUser({ provider, providerId, email, name }) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail) {
    const error = new Error("The provider did not return an email address.");
    error.status = 400;
    throw error;
  }

  let user = await findUserByProvider(provider, providerId);
  if (!user) {
    user = await findUserByEmail(cleanEmail);
    if (user) {
      await linkProviderToUser({ userId: user.id, provider, providerId });
      user = { ...user, auth_provider: provider, provider_id: providerId };
    } else {
      user = await createProviderUser({
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        provider,
        providerId,
      });
    }
  }

  return { token: createToken(user), user: publicUser(user) };
}

async function registerAccount({ name, email, password, role = "customer" }) {
  const cleanName = name?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanName || !cleanEmail || !password || password.length < 6) {
    const error = new Error("Name, email, and a password of at least 6 characters are required.");
    error.status = 400;
    throw error;
  }

  if (await findUserByEmail(cleanEmail)) {
    const error = new Error("An account with this email already exists.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name: cleanName, email: cleanEmail, passwordHash, role });
  return { token: createToken(user), user: publicUser(user) };
}

export async function register(details) {
  return registerAccount({ ...details, role: "customer" });
}

export async function adminRegister(details) {
  return registerAccount({ ...details, role: "admin" });
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email?.trim().toLowerCase() || "");
  const matches = user?.password_hash && (await bcrypt.compare(password || "", user.password_hash));

  if (!matches) {
    const error = new Error("Invalid email address or password.");
    error.status = 401;
    throw error;
  }

  return { token: createToken(user), user: publicUser(user) };
}

export async function adminLogin(credentials) {
  const session = await login(credentials);
  if (session.user.role !== "admin") {
    const error = new Error("Administrator access is required.");
    error.status = 403;
    throw error;
  }
  return session;
}

export async function googleLogin({ credential, accessToken }) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw providerNotConfigured("Google");
  }
  if (!credential && !accessToken) {
    const error = new Error("Google login token is required.");
    error.status = 400;
    throw error;
  }

  let payload;
  if (credential) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } else {
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
    );
    payload = await tokenInfoResponse.json();
    if (!tokenInfoResponse.ok || payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      const error = new Error("Google login could not be verified.");
      error.status = 401;
      throw error;
    }
  }

  if (!payload?.email || !payload.email_verified) {
    const error = new Error("Google did not verify this email address.");
    error.status = 401;
    throw error;
  }

  return sessionForProviderUser({
    provider: "google",
    providerId: payload.sub,
    email: payload.email,
    name: payload.name,
  });
}

export async function facebookLogin({ accessToken }) {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    throw providerNotConfigured("Facebook");
  }
  if (!accessToken) {
    const error = new Error("Facebook access token is required.");
    error.status = 400;
    throw error;
  }

  const appToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
  const debugResponse = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appToken)}`,
  );
  const debugResult = await debugResponse.json();
  if (!debugResult.data?.is_valid || debugResult.data.app_id !== process.env.FACEBOOK_APP_ID) {
    const error = new Error("Facebook token could not be verified.");
    error.status = 401;
    throw error;
  }

  const profileResponse = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`,
  );
  const profile = await profileResponse.json();
  if (!profile.email) {
    const error = new Error("Facebook did not return an email address.");
    error.status = 400;
    throw error;
  }

  return sessionForProviderUser({
    provider: "facebook",
    providerId: profile.id,
    email: profile.email,
    name: profile.name,
  });
}

export async function passkeyRegisterOptions(authenticatedUser) {
  const user = await findUserById(authenticatedUser.id);
  if (!user) {
    const error = new Error("User account was not found.");
    error.status = 404;
    throw error;
  }

  const passkeys = await findPasskeysByUserId(user.id);
  const { rpName, rpID } = webAuthnConfig();
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.email,
    userID: new TextEncoder().encode(String(user.id)),
    userDisplayName: user.name,
    attestationType: "none",
    excludeCredentials: passkeys.map((passkey) => ({
      id: passkey.credential_id,
      transports: parseTransports(passkey.transports),
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
  });

  passkeyRegistrationChallenges.set(String(user.id), options.challenge);
  return options;
}

export async function passkeyRegisterVerify(authenticatedUser, { response, deviceName }) {
  const expectedChallenge = passkeyRegistrationChallenges.get(String(authenticatedUser.id));
  if (!expectedChallenge) {
    const error = new Error("Passkey registration has expired. Please try again.");
    error.status = 400;
    throw error;
  }

  const { origins, rpID } = webAuthnConfig();
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origins,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  passkeyRegistrationChallenges.delete(String(authenticatedUser.id));

  if (!verification.verified) {
    const error = new Error("Passkey registration could not be verified.");
    error.status = 401;
    throw error;
  }

  const { credential } = verification.registrationInfo;
  await createPasskey({
    userId: authenticatedUser.id,
    credentialId: credential.id,
    publicKey: bytesToBase64Url(credential.publicKey),
    counter: credential.counter,
    deviceName: deviceName || "Passkey",
    transports: credential.transports,
  });

  return { message: "Passkey added successfully." };
}

export async function passkeyLoginOptions({ email }) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail) {
    const error = new Error("Enter your email address before using passkey sign-in.");
    error.status = 400;
    throw error;
  }

  const user = await findUserByEmail(cleanEmail);
  if (!user) {
    const error = new Error("No FreshMart account was found for that email address.");
    error.status = 404;
    throw error;
  }

  const passkeys = await findPasskeysByUserId(user.id);
  if (!passkeys.length) {
    const error = new Error("No passkey is registered for this account. Sign in with email and password, then add a passkey.");
    error.status = 404;
    throw error;
  }

  const { rpID } = webAuthnConfig();
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: passkeys.map((passkey) => ({
      id: passkey.credential_id,
      transports: parseTransports(passkey.transports),
    })),
    userVerification: "required",
  });

  passkeyLoginChallenges.set(options.challenge, { email: cleanEmail || "" });
  return options;
}

export async function passkeyLoginVerify({ response, challenge, email }) {
  const pending = passkeyLoginChallenges.get(challenge);
  if (!pending) {
    const error = new Error("Passkey login has expired. Please try again.");
    error.status = 400;
    throw error;
  }

  const passkey = await findPasskeyByCredentialId(response?.id);
  if (!passkey) {
    const error = new Error("This passkey is not registered with FreshMart.");
    error.status = 401;
    throw error;
  }

  const cleanEmail = email?.trim().toLowerCase() || pending.email;
  if (cleanEmail && passkey.email.toLowerCase() !== cleanEmail) {
    const error = new Error("This passkey does not belong to that email address.");
    error.status = 401;
    throw error;
  }

  const { origins, rpID } = webAuthnConfig();
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origins,
    expectedRPID: rpID,
    credential: credentialFromRow(passkey),
    requireUserVerification: true,
  });
  passkeyLoginChallenges.delete(challenge);

  if (!verification.verified) {
    const error = new Error("Passkey login could not be verified.");
    error.status = 401;
    throw error;
  }

  await updatePasskeyCounter({
    credentialId: verification.authenticationInfo.credentialID,
    counter: verification.authenticationInfo.newCounter,
  });

  const user = {
    id: passkey.user_id,
    name: passkey.name,
    email: passkey.email,
    role: passkey.role,
  };
  return { token: createToken(user), user: publicUser(user) };
}
