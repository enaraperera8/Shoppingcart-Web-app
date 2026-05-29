import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

function providerError(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.76-.07-1.48-.2-2.18H12v4.12h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.47z"
        fill="#4285f4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.3l-3.22-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.75-5.59-4.12H3.08v2.59A9.99 9.99 0 0 0 12 22z"
        fill="#34a853"
      />
      <path
        d="M6.41 14.02A6 6 0 0 1 6.1 12c0-.7.11-1.38.31-2.02V7.39H3.08A9.99 9.99 0 0 0 2 12c0 1.61.39 3.14 1.08 4.61l3.33-2.59z"
        fill="#fbbc05"
      />
      <path
        d="M12 5.86c1.47 0 2.79.51 3.82 1.5l2.86-2.86C16.95 2.89 14.69 2 12 2a9.99 9.99 0 0 0-8.92 5.39l3.33 2.59C7.2 7.61 9.4 5.86 12 5.86z"
        fill="#ea4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"
        fill="#1877f2"
      />
    </svg>
  );
}

function PasskeyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M7.75 10.5a4.25 4.25 0 1 1 7.52 2.71l4.48 4.48v2.56h-2.56l-.9-.9-.95.95h-2.2v-2.2l-.96-.96a4.25 4.25 0 0 1-4.43-6.64zm4.25.55a1.2 1.2 0 1 0-2.4 0 1.2 1.2 0 0 0 2.4 0z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleAccessButton({ disabled, onLogin, onError }) {
  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onError,
    onSuccess: ({ access_token: accessToken }) => onLogin(accessToken),
  });

  return (
    <button
      className="provider-button google-provider"
      disabled={disabled}
      onClick={() => login()}
      type="button"
    >
      <span className="provider-icon">
        <GoogleIcon />
      </span>
      Continue with Google
    </button>
  );
}

function requestFacebookAccessToken() {
  return new Promise((resolve, reject) => {
    if (!facebookAppId) {
      reject(new Error("Facebook login is not configured yet."));
      return;
    }

    const redirectUri = `${window.location.origin}/facebook-auth.html`;
    const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
    authUrl.searchParams.set("client_id", facebookAppId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "token");
    authUrl.searchParams.set("scope", "email,public_profile");

    const popup = window.open(authUrl.toString(), "freshmart-facebook-login", "width=520,height=680");
    if (!popup) {
      reject(new Error("Allow popups to continue with Facebook."));
      return;
    }

    const timeout = window.setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      popup.close();
      reject(new Error("Facebook login timed out."));
    }, 120000);

    function handleMessage(event) {
      if (event.origin !== window.location.origin || event.data?.type !== "facebook-auth") {
        return;
      }
      window.clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);
      popup.close();
      if (event.data.error) {
        reject(new Error(event.data.error));
        return;
      }
      resolve(event.data.accessToken);
    }

    window.addEventListener("message", handleMessage);
  });
}

export default function Login({ adminMode = false }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [providerLoading, setProviderLoading] = useState("");
  const { facebookLogin, googleLogin, login, adminLogin, passkeyLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await (adminMode ? adminLogin(credentials) : login(credentials));
      navigate(user.role === "admin" ? "/admin" : "/products");
    } catch (requestError) {
      setError(providerError(requestError, "Login failed. Please try again."));
    }
  };

  const finishProviderLogin = async (loginAction) => {
    setError("");
    try {
      const user = await loginAction();
      navigate(user.role === "admin" ? "/admin" : "/products");
    } catch (requestError) {
      setError(providerError(requestError, "Login failed. Please try again."));
    } finally {
      setProviderLoading("");
    }
  };

  const handleFacebookLogin = () => {
    setProviderLoading("facebook");
    finishProviderLogin(async () => {
      const accessToken = await requestFacebookAccessToken();
      return facebookLogin(accessToken);
    });
  };

  const handleProviderSetupNeeded = (provider) => {
    setError(`${provider} sign-in is not connected yet. Please use another sign-in option for now.`);
  };

  const handlePasskeyLogin = () => {
    if (!credentials.email.trim()) {
      setError("Enter your email address first, then choose Sign in with Passkey.");
      return;
    }
    setProviderLoading("passkey");
    finishProviderLogin(() => passkeyLogin(credentials.email.trim()));
  };

  return (
    <section className="auth-layout">
      <aside className="auth-story">
        <span>FreshMart membership</span>
        <h2>{adminMode ? "The market desk." : "Your cart remembers."}</h2>
        <p>
          {adminMode
            ? "Curate departments, restock the table, and guide today's collection."
            : "Sign in to continue building a cart of seasonal staples and sweet finds."}
        </p>
      </aside>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{adminMode ? "Admin login" : "Welcome back"}</h1>
        <p>{adminMode ? "Sign in to manage the catalog." : "Log in to continue shopping."}</p>
        {error && <div className="form-error">{error}</div>}
        <label>
          Email address
          <input
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
            required
            type="email"
            value={credentials.email}
          />
        </label>
        <label>
          Password
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            required
            type="password"
            value={credentials.password}
          />
        </label>
        <button className="button auth-button" type="submit">
          {adminMode ? "Enter dashboard" : "Sign in"}
        </button>
        {!adminMode && (
          <div className="secure-login-options">
            <div className="auth-divider">
              <span>or continue with</span>
            </div>
            {googleClientId ? (
              <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleAccessButton
                  disabled={providerLoading === "google"}
                  onError={() => setError("Google login was cancelled or failed.")}
                  onLogin={(accessToken) => {
                    setProviderLoading("google");
                    finishProviderLogin(() => googleLogin(accessToken));
                  }}
                />
              </GoogleOAuthProvider>
            ) : (
              <button
                className="provider-button"
                onClick={() => handleProviderSetupNeeded("Google")}
                type="button"
              >
                <span className="provider-icon">
                  <GoogleIcon />
                </span>
                Continue with Google
              </button>
            )}
            <button
              className="provider-button facebook-provider"
              disabled={providerLoading === "facebook"}
              onClick={
                facebookAppId
                  ? handleFacebookLogin
                  : () => handleProviderSetupNeeded("Facebook")
              }
              type="button"
            >
              <span className="provider-icon">
                <FacebookIcon />
              </span>
              {providerLoading === "facebook" ? "Connecting..." : "Continue with Facebook"}
            </button>
            <button
              className="provider-button passkey-provider"
              disabled={providerLoading === "passkey"}
              onClick={handlePasskeyLogin}
              type="button"
            >
              <span className="provider-icon">
                <PasskeyIcon />
              </span>
              {providerLoading === "passkey" ? "Checking passkey..." : "Sign in with Passkey"}
            </button>
          </div>
        )}
        <span>
          {adminMode ? (
            <>
              Need admin access? <Link to="/admin/register">Create admin account</Link>
            </>
          ) : (
            <>
              New here? <Link to="/register">Create an account</Link>
            </>
          )}
        </span>
      </form>
    </section>
  );
}
