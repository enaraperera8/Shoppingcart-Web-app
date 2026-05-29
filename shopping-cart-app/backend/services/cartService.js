import { clearCartItems, deleteCartItem, findCartItems, upsertCartItem } from "../models/Cart.js";
import { findProductById } from "../models/Product.js";

function formatStockQuantity(product) {
  if (product.unit_grams) {
    const totalGrams = product.stock_quantity * product.unit_grams;
    return totalGrams >= 1000 && totalGrams % 1000 === 0
      ? `${totalGrams / 1000} kg`
      : `${totalGrams} g`;
  }
  return `${product.stock_quantity} item(s)`;
}

function maximumOrderQuantity(product) {
  if (!product.unit_grams) {
    return product.stock_quantity;
  }
  return Math.min(product.stock_quantity, Math.floor(5000 / product.unit_grams));
}

export async function getUserCart(userId) {
  return findCartItems(userId);
}

export async function setCartItem(userId, productId, quantity) {
  const normalizedProductId = Number(productId);
  const amount = Number(quantity);
  if (!Number.isInteger(normalizedProductId) || normalizedProductId < 1) {
    const error = new Error("Product id must be a positive whole number.");
    error.status = 400;
    throw error;
  }
  if (!Number.isInteger(amount) || amount < 1) {
    const error = new Error("Quantity must be a positive whole number.");
    error.status = 400;
    throw error;
  }

  const product = await findProductById(normalizedProductId);
  if (!product) {
    const error = new Error("Product not found.");
    error.status = 404;
    throw error;
  }
  if (amount > maximumOrderQuantity(product)) {
    const error = new Error(
      product.unit_grams && product.stock_quantity * product.unit_grams >= 5000
        ? "A maximum of 5 kg can be purchased for each weighted item."
        : `Only ${formatStockQuantity(product)} available in stock.`,
    );
    error.status = 409;
    throw error;
  }

  return upsertCartItem(userId, normalizedProductId, amount);
}

export async function removeUserCartItem(userId, productId) {
  return deleteCartItem(userId, productId);
}

export async function clearUserCart(userId) {
  return clearCartItems(userId);
}

export async function getCheckoutSummary(userId) {
  const items = await findCartItems(userId);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  return {
    items,
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: 0,
    total: Number(subtotal.toFixed(2)),
    paymentAvailable: false,
  };
}
