import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { clearCartItems, getCart, removeCartItem, saveCartItem } from "../services/cartService";
import { salePrice } from "../utils/pricing";
import { formatProductStock, maximumOrderQuantity } from "../utils/productUnits";

const CartContext = createContext(null);
const guestCartKey = "freshmart_cart_weighted_market_100g";

function cartErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(guestCartKey);
    return stored ? JSON.parse(stored) : [];
  });
  const [syncError, setSyncError] = useState("");
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) {
      setItems(JSON.parse(localStorage.getItem(guestCartKey) || "[]"));
      setSyncError("");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getCart()
      .then((cartItems) => {
        if (active) {
          setItems(cartItems);
          setSyncError("");
        }
      })
      .catch(() => {
        if (active) {
          setSyncError("Unable to load your saved cart.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(guestCartKey, JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product, quantity = 1) => {
    const amountToAdd = Math.max(1, Number(quantity) || 1);
    if (!user) {
      const present = items.find((item) => item.id === product.id);
      const nextQuantity = present ? present.quantity + amountToAdd : amountToAdd;
      const maximumQuantity = maximumOrderQuantity(product);
      if (nextQuantity > maximumQuantity) {
        setSyncError(
          product.unit_grams && product.stock_quantity * product.unit_grams >= 5000
            ? "A maximum of 5 kg can be purchased for each weighted item."
            : `Only ${formatProductStock(product)} available in stock.`,
        );
        return;
      }
      setSyncError("");
      setItems((currentItems) => {
        if (currentItems.some((item) => item.id === product.id)) {
          return currentItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + amountToAdd } : item,
          );
        }
        return [...currentItems, { ...product, quantity: amountToAdd }];
      });
      return;
    }

    const present = items.find((item) => item.id === product.id);
    try {
      setSyncError("");
      setItems(await saveCartItem(product.id, present ? present.quantity + amountToAdd : amountToAdd));
    } catch (error) {
      setSyncError(cartErrorMessage(error, "Unable to add this item to your saved cart."));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const validQuantity = Math.max(1, quantity || 1);
    if (!user) {
      const item = items.find((currentItem) => currentItem.id === productId);
      const maximumQuantity = item ? maximumOrderQuantity(item) : validQuantity;
      const adjustedQuantity = item?.stock_quantity
        ? Math.min(validQuantity, maximumQuantity)
        : validQuantity;
      setSyncError(
        adjustedQuantity !== validQuantity
          ? item.unit_grams
            && item.stock_quantity * item.unit_grams >= 5000
            ? "A maximum of 5 kg can be purchased for each weighted item."
            : `Only ${formatProductStock(item)} available in stock.`
          : "",
      );
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === productId
            ? { ...currentItem, quantity: adjustedQuantity }
            : currentItem,
        ),
      );
      return;
    }

    try {
      setSyncError("");
      setItems(await saveCartItem(productId, validQuantity));
    } catch (error) {
      setSyncError(cartErrorMessage(error, "Unable to update your saved cart."));
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
      return;
    }

    try {
      setSyncError("");
      setItems(await removeCartItem(productId));
    } catch (error) {
      setSyncError(cartErrorMessage(error, "Unable to remove this item from your saved cart."));
    }
  };

  const clearCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setSyncError("");
      setItems(await clearCartItems());
    } catch (error) {
      setSyncError(cartErrorMessage(error, "Unable to clear your saved cart."));
    }
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + salePrice(item) * item.quantity, 0);
  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      itemCount,
      total,
      syncError,
      loading,
    }),
    [items, itemCount, total, syncError, loading, user],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
