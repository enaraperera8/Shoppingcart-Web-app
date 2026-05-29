import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatLkr } from "../utils/currency";
import { productImageSrc } from "../utils/images";
import { salePrice } from "../utils/pricing";
import { formatProductQuantity, formatWeight, isWeightedProduct } from "../utils/productUnits";
import "../styles/Cart.css";

export default function Checkout() {
  const { items, total, itemCount } = useCart();

  if (!items.length) {
    return (
      <section className="cart-page">
        <header className="section-header">
          <h1>Checkout</h1>
        </header>
        <div className="empty-state">
          <p>Your order summary is empty. Begin at today's market table.</p>
          <Link className="button" to="/products">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page checkout-page">
      <header className="section-header">
        <h1>Market receipt</h1>
        <p>Review the cart before the final step.</p>
      </header>
      <div className="checkout-layout">
        <div className="checkout-items">
          {items.map((item) => (
            <article className="checkout-item" key={item.id}>
              <img alt={item.name} src={productImageSrc(item.image_url, "https://placehold.co/72x72?text=Item")} />
              <div>
                <h2>{item.name}</h2>
                <p>
                  {isWeightedProduct(item)
                    ? `${formatProductQuantity(item.quantity, item)} at ${formatLkr(salePrice(item))} / ${formatWeight(item.unit_grams)}`
                    : `${formatProductQuantity(item.quantity, item)} x ${formatLkr(salePrice(item))}`}
                </p>
              </div>
              <strong>{formatLkr(salePrice(item) * item.quantity)}</strong>
            </article>
          ))}
        </div>
        <aside className="summary checkout-summary">
          <h2>Cart total</h2>
          <div>
            <span>Quantity units ({itemCount})</span>
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
          <p className="payment-note">
            Online payment will be introduced in a future edition.
          </p>
          <Link className="button secondary edit-cart" to="/cart">
            Edit cart
          </Link>
        </aside>
      </div>
    </section>
  );
}
