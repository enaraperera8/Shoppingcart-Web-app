import React, { createContext, useContext, useMemo, useState } from "react";
import {
  createPasskey,
  loginAdmin,
  loginUser,
  loginWithFacebook,
  loginWithGoogle,
  loginWithPasskey,
  registerAdmin,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);
const tokenKey = "freshmart_token";
const userKey = "freshmart_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(userKey) || localStorage.getItem("shopnest_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const saveSession = ({ token, user: authenticatedUser }) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(userKey, JSON.stringify(authenticatedUser));
    localStorage.removeItem("shopnest_token");
    localStorage.removeItem("shopnest_user");
    setUser(authenticatedUser);
  };

  const login = async (credentials) => {
    const session = await loginUser(credentials);
    saveSession(session);
    return session.user;
  };

  const register = async (details) => {
    const session = await registerUser(details);
    saveSession(session);
    return session.user;
  };

  const adminRegister = async (details) => {
    const session = await registerAdmin(details);
    saveSession(session);
    return session.user;
  };

  const adminLogin = async (credentials) => {
    const session = await loginAdmin(credentials);
    saveSession(session);
    return session.user;
  };

  const googleLogin = async (credential) => {
    const session = await loginWithGoogle(credential);
    saveSession(session);
    return session.user;
  };

  const facebookLogin = async (accessToken) => {
    const session = await loginWithFacebook(accessToken);
    saveSession(session);
    return session.user;
  };

  const passkeyLogin = async (email) => {
    const session = await loginWithPasskey(email);
    saveSession(session);
    return session.user;
  };

  const registerPasskey = async (deviceName) => createPasskey(deviceName);

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      adminLogin,
      adminRegister,
      register,
      googleLogin,
      facebookLogin,
      passkeyLogin,
      registerPasskey,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
