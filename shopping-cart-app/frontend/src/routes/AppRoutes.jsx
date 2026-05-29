import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Register from "../pages/Register";

function AdminRoute({ children }) {
  const { user } = useAuth();
  const savedUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("freshmart_user") || localStorage.getItem("shopnest_user") || "null",
      );
    } catch {
      return null;
    }
  })();
  const activeUser = user || savedUser;
  return activeUser?.role === "admin" ? children : <Navigate replace to="/admin/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Products />} path="/products" />
      <Route element={<Cart />} path="/cart" />
      <Route element={<Checkout />} path="/checkout" />
      <Route element={<Login />} path="/login" />
      <Route element={<Login adminMode />} path="/admin/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Register adminMode />} path="/admin/register" />
      <Route
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
        path="/admin"
      />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
