import api from "./api";

export async function getProducts() {
  const { data } = await api.get("/products");
  return data;
}

export async function createProduct(product) {
  const { data } = await api.post("/products", product);
  return data;
}

export async function updateProduct(productId, product) {
  const { data } = await api.put(`/products/${productId}`, product);
  return data;
}

export async function uploadProductImage(file) {
  const { data } = await api.post("/products/image-upload", file, {
    headers: { "Content-Type": file.type },
  });
  return data;
}

export async function deleteProduct(productId) {
  await api.delete(`/products/${productId}`);
}
