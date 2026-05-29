import api from "./api";

export async function getCart() {
  const { data } = await api.get("/cart");
  return data;
}

export async function saveCartItem(productId, quantity) {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
}

export async function removeCartItem(productId) {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
}

export async function clearCartItems() {
  const { data } = await api.delete("/cart");
  return data;
}
