import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, registerPasskey } = useAuth();
  const { itemCount } = useCart();
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const handleAddPasskey = async () => {
    setPasskeyLoading(true);
    try {
      await registerPasskey("FreshMart passkey");
      window.alert("Passkey added successfully.");
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || "Unable to add passkey.");
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <NavLink className="brand" to="/">
          <span className="brand-mark">F</span>
          <span className="brand-copy">
            <strong>FreshMart</strong>
            <small>fresh market</small>
          </span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/products">Market</NavLink>
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          <NavLink className="cart-link" to="/cart">
            Cart <span className="cart-count">{itemCount}</span>
          </NavLink>
          {user ? (
            <>
              <button
                className="button secondary"
                disabled={passkeyLoading}
                onClick={handleAddPasskey}
                type="button"
              >
                {passkeyLoading ? "Adding..." : "Add Passkey"}
              </button>
              <button className="button secondary" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/admin/login">Admin</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
