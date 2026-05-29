import api from "./api";

export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}

export async function createCategory(name) {
  const { data } = await api.post("/categories", { name });
  return data;
}

export async function updateCategory(categoryId, name) {
  const { data } = await api.put(`/categories/${categoryId}`, { name });
  return data;
}

export async function deleteCategory(categoryId) {
  await api.delete(`/categories/${categoryId}`);
}
