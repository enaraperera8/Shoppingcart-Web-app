import React from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { formatLkr } from "../utils/currency";
import "../styles/Cart.css";

export default function Cart() {
  const { items, itemCount, total, clearCart, loading, syncError } = useCart();

  if (loading) {
    return (
      <section className="cart-page">
        <header className="section-header">
          <h1>Your cart</h1>
        </header>
        <div className="empty-state">Loading your saved cart...</div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="cart-page">
        <header className="section-header">
          <h1>Your cart</h1>
        </header>
        {syncError && <p className="cart-error">{syncError}</p>}
        <div className="empty-state">Your cart is empty. Visit the market to begin.</div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <header className="section-header">
        <h1>Your cart</h1>
        <p>Adjust your selection before reviewing the order.</p>
      </header>
      {syncError && <p className="cart-error">{syncError}</p>}
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem item={item} key={item.id} />
          ))}
        </div>
        <aside className="summary">
          <h2>Cart total</h2>
          <div>
            <span>Quantity units</span>
            <strong>{itemCount}</strong>
          </div>
          <div>
            <span>Subtotal</span>
            <strong>{formatLkr(total)}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatLkr(total)}</strong>
          </div>
          <Link className="button checkout" to="/checkout">
            Checkout
          </Link>
          <button className="clear-cart" onClick={clearCart} type="button">
            Empty cart
          </button>
        </aside>
      </div>
    </section>
  );
}
