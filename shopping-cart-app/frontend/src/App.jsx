import React from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main className="page-container">
          <AppRoutes />
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
