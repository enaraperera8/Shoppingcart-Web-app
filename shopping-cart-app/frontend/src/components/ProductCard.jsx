import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatLkr } from "../utils/currency";
import {
  formatProductQuantity,
  formatProductStock,
  formatWeight,
  isWeightedProduct,
  weightOptions,
} from "../utils/productUnits";
import { productImageSrc } from "../utils/images";
import { discountPercent, hasDiscount, salePrice } from "../utils/pricing";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const weighted = isWeightedProduct(product);
  const discounted = hasDiscount(product);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => setQuantity(1), [product.id]);

  return (
    <article className="product-card">
      <img
        alt={product.name}
        className="product-image"
        src={productImageSrc(product.image_url)}
      />
      {discounted && <span className="product-discount-badge">{discountPercent(product)}% off</span>}
      <div className="product-content">
        <span className="category">
          {product.subcategory || product.category_name || "Featured"}
        </span>
        <h3>{product.name}</h3>
        <div className="product-price">
          <strong>
            {formatLkr(salePrice(product))}
            {weighted && <small> / {formatWeight(product.unit_grams)}</small>}
          </strong>
          {discounted && <span>{formatLkr(product.price)}</span>}
        </div>
        <p className="product-description">{product.description}</p>
        {product.stock_quantity !== undefined && (
          <p className="stock-status">
            {product.stock_quantity > 0
              ? `${formatProductStock(product)} available`
              : "Currently out of stock"}
          </p>
        )}
        <div className="product-actions">
          {weighted && product.stock_quantity > 0 && (
            <label className="weight-picker">
              <span>Choose quantity</span>
              <select
                aria-label={`Choose quantity for ${product.name}`}
                onChange={(event) => setQuantity(Number(event.target.value))}
                value={quantity}
              >
                {weightOptions(product).map((amount) => (
                  <option key={amount} value={amount}>
                    {formatProductQuantity(amount, product)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="button"
            disabled={product.stock_quantity === 0}
            onClick={() => addToCart(product, weighted ? quantity : 1)}
            type="button"
          >
            {product.stock_quantity === 0
              ? "Out of stock"
              : weighted
                ? `Add ${formatProductQuantity(quantity, product)}`
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
