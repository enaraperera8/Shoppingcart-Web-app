import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Register({ adminMode = false }) {
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createPasskey, setCreatePasskey] = useState(false);
  const [passkeyPending, setPasskeyPending] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const { adminRegister, register, registerPasskey } = useAuth();
  const navigate = useNavigate();
  const destination = adminMode ? "/admin" : "/products";
  const goToAccountHome = (createdUser) => {
    navigate(createdUser?.role === "admin" ? "/admin" : "/products", { replace: true });
  };

  const createAccountPasskey = async () => {
    setPasskeyLoading(true);
    setError("");
    setNotice("");
    try {
      await registerPasskey(adminMode ? "FreshMart admin passkey" : "FreshMart passkey");
      navigate(destination, { replace: true });
    } catch (passkeyError) {
      setPasskeyPending(true);
      setNotice(
        passkeyError.message ||
          "Passkey setup was not completed. Make sure Windows Hello or a device PIN is enabled, then try Create passkey now.",
      );
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setPasskeyPending(false);
    try {
      const createdUser = await (adminMode ? adminRegister(details) : register(details));
      if (createPasskey) {
        try {
          await createAccountPasskey();
        } catch (passkeyError) {
          setPasskeyPending(true);
          setNotice(
            passkeyError.message ||
              "Your account was created, but passkey setup was not completed. Use Create passkey now to try again.",
          );
        }
        return;
      }
      goToAccountHome(createdUser);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="auth-layout">
      <aside className="auth-story">
        <span>{adminMode ? "FreshMart admin" : "Become a regular"}</span>
        <h2>{adminMode ? "Create your market desk." : "A market cart of your own."}</h2>
        <p>
          {adminMode
            ? "Register an administrator account to manage products, categories, and stock."
            : "Save your selections, track quantities, and return to the freshest table whenever you please."}
        </p>
      </aside>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{adminMode ? "Create admin account" : "Create account"}</h1>
        <p>
          {adminMode
            ? "Register to manage the FreshMart catalog."
            : "Join FreshMart and begin your first cart."}
        </p>
        {error && <div className="form-error">{error}</div>}
        {notice && <div className="form-error">{notice}</div>}
        <label>
          Full name
          <input
            onChange={(event) => setDetails({ ...details, name: event.target.value })}
            required
            value={details.name}
          />
        </label>
        <label>
          Email address
          <input
            onChange={(event) => setDetails({ ...details, email: event.target.value })}
            required
            type="email"
            value={details.email}
          />
        </label>
        <label>
          Password
          <input
            minLength="6"
            onChange={(event) => setDetails({ ...details, password: event.target.value })}
            required
            type="password"
            value={details.password}
          />
        </label>
        <label className="auth-checkbox">
          <input
            checked={createPasskey}
            onChange={(event) => setCreatePasskey(event.target.checked)}
            type="checkbox"
          />
          Create a passkey for faster sign in
        </label>
        <button className="button auth-button" type="submit">
          {adminMode ? "Create admin account" : "Create membership"}
        </button>
        {passkeyPending && (
          <div className="passkey-actions">
            <button className="button auth-button" disabled={passkeyLoading} onClick={createAccountPasskey} type="button">
              {passkeyLoading ? "Creating passkey..." : "Create passkey now"}
            </button>
            <button className="auth-secondary-button" onClick={() => navigate(destination, { replace: true })} type="button">
              Continue without passkey
            </button>
          </div>
        )}
        <span>
          {adminMode ? (
            <>
              Already registered? <Link to="/admin/login">Admin login</Link>
            </>
          ) : (
            <>
              Already registered? <Link to="/login">Log in</Link>
            </>
          )}
        </span>
      </form>
    </section>
  );
}
