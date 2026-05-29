import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">FreshMart / Daily edition</span>
          <h1>
            Gather the
            <em> good things.</em>
          </h1>
          <p>
            A quiet corner for crisp greens, bright fruit, bakery comforts,
            chilled dairy, and table-ready favourites.
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/products">
              Enter the market
            </Link>
            <Link className="button secondary" to="/register">
              Begin a cart
            </Link>
          </div>
          <div className="hero-note">
            <strong>06</strong>
            <span>curated departments<br />freshly stocked today</span>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-card">
            <span>Market note</span>
            <strong>Berry cake + citrus</strong>
            <p>Pair something sweet with this week's brightest produce.</p>
          </div>
        </div>
      </section>

      <section className="departments" aria-label="Shop departments">
        <span className="departments-title">In the market</span>
        <Link to="/products">Vegetables <small>01</small></Link>
        <Link to="/products">Fruits <small>02</small></Link>
        <Link to="/products">Meat &amp; Seafood <small>03</small></Link>
        <Link to="/products">Bakery Items <small>04</small></Link>
        <Link to="/products">Dairy Items <small>05</small></Link>
        <Link to="/products">Sweets &amp; Beverages <small>06</small></Link>
      </section>

      <div className="benefits">
        <article>
          <span className="benefit-index">01</span>
          <strong>Seasonal selection</strong>
          <span>Fresh categories assembled like a daily market table.</span>
        </article>
        <article>
          <span className="benefit-index">02</span>
          <strong>Living cart</strong>
          <span>Quantities and totals respond the instant you choose.</span>
        </article>
        <article>
          <span className="benefit-index">03</span>
          <strong>Considered checkout</strong>
          <span>Review every item clearly before completing your order.</span>
        </article>
      </div>
    </div>
  );
}
