import {
  deleteCategory as removeCategory,
  findAllCategories,
  insertCategory,
  updateCategory as renameCategory,
} from "../models/Category.js";

function validateName(name) {
  if (!name?.trim()) {
    const error = new Error("Category name is required.");
    error.status = 400;
    throw error;
  }
  return name.trim();
}

export async function getCategories(_request, response) {
  response.json(await findAllCategories());
}

export async function createCategory(request, response) {
  response.status(201).json(await insertCategory(validateName(request.body.name)));
}

export async function updateCategory(request, response) {
  const category = await renameCategory(request.params.id, validateName(request.body.name));
  if (!category) {
    const error = new Error("Category not found.");
    error.status = 404;
    throw error;
  }
  response.json(category);
}

export async function deleteCategory(request, response) {
  if (!(await removeCategory(request.params.id))) {
    const error = new Error("Category not found.");
    error.status = 404;
    throw error;
  }
  response.status(204).send();
}
