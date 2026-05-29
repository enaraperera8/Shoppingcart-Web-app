import React from "react";
import { useCart } from "../context/CartContext";
import { formatLkr } from "../utils/currency";
import {
  formatProductQuantity,
  formatProductStock,
  formatWeight,
  isWeightedProduct,
  maximumOrderQuantity,
  weightOptions,
} from "../utils/productUnits";
import { productImageSrc } from "../utils/images";
import { salePrice, hasDiscount } from "../utils/pricing";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();
  const weighted = isWeightedProduct(item);

  return (
    <article className="cart-item">
      <img alt={item.name} src={productImageSrc(item.image_url, "https://placehold.co/96x96?text=Item")} />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>
          {formatLkr(item.price)}
          {hasDiscount(item) && ` now ${formatLkr(salePrice(item))}`}
          {weighted && ` / ${formatWeight(item.unit_grams)}`}
        </p>
      </div>
      {weighted ? (
        <label className="cart-weight-picker">
          <span>Quantity</span>
          <select
            aria-label={`Quantity for ${item.name}`}
            onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
            value={Math.min(item.quantity, maximumOrderQuantity(item))}
          >
            {weightOptions(item).map((amount) => (
              <option key={amount} value={amount}>
                {formatProductQuantity(amount, item)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="quantity-control">
          <button
            aria-label={`Decrease quantity for ${item.name}`}
            disabled={item.quantity <= 1}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            type="button"
          >
            -
          </button>
          <output aria-label={`Quantity for ${item.name}`} className="quantity-value">
            {formatProductQuantity(item.quantity, item)}
          </output>
          <button
            aria-label={`Increase quantity for ${item.name}`}
            disabled={item.stock_quantity ? item.quantity >= item.stock_quantity : false}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
      )}
      {item.stock_quantity !== undefined && (
        <small className="cart-stock">{formatProductStock(item)} available</small>
      )}
      <strong>{formatLkr(salePrice(item) * item.quantity)}</strong>
      <button className="remove" onClick={() => removeFromCart(item.id)} type="button">
        Remove
      </button>
    </article>
  );
}
