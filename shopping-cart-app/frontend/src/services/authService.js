import api from "./api";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

export async function loginUser(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function loginAdmin(credentials) {
  const { data } = await api.post("/auth/admin/login", credentials);
  return data;
}

export async function registerUser(details) {
  const { data } = await api.post("/auth/register", details);
  return data;
}

export async function registerAdmin(details) {
  const { data } = await api.post("/auth/admin/register", details);
  return data;
}

export async function loginWithGoogle(accessToken) {
  const { data } = await api.post("/auth/google", { accessToken });
  return data;
}

export async function loginWithFacebook(accessToken) {
  const { data } = await api.post("/auth/facebook", { accessToken });
  return data;
}

export async function loginWithPasskey(email) {
  try {
    const { data: options } = await api.post("/auth/passkey/login/options", { email });
    const response = await startAuthentication({ optionsJSON: options });
    const { data } = await api.post("/auth/passkey/login/verify", {
      response,
      challenge: options.challenge,
      email,
    });
    return data;
  } catch (error) {
    if (error.name === "NotAllowedError" || error.name === "AbortError") {
      throw new Error("Passkey sign-in was cancelled, timed out, or no matching passkey was found for this device.");
    }
    throw error;
  }
}

export async function createPasskey(deviceName = "Passkey") {
  try {
    const { data: options } = await api.post("/auth/passkey/register/options");
    const response = await startRegistration({ optionsJSON: options });
    const { data } = await api.post("/auth/passkey/register/verify", {
      response,
      deviceName,
    });
    return data;
  } catch (error) {
    if (error.name === "NotAllowedError" || error.name === "AbortError") {
      throw new Error("Passkey setup was cancelled or timed out. Try again and approve the Windows Hello or device PIN prompt.");
    }
    throw error;
  }
}
