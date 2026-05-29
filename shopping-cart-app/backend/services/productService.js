import {
  findAllProducts,
  findProductById,
  insertProduct,
  removeProduct,
  updateProduct as saveProduct,
} from "../models/Product.js";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, "../uploads/products");
const imageExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function listProducts(filters) {
  const categoryId = filters.categoryId ? Number(filters.categoryId) : null;
  if (filters.categoryId && (!Number.isInteger(categoryId) || categoryId < 1)) {
    const error = new Error("Category id must be a positive whole number.");
    error.status = 400;
    throw error;
  }
  return findAllProducts({
    categoryId,
    search: filters.search?.trim() || "",
  });
}

export async function getProduct(productId) {
  const product = await findProductById(productId);
  if (!product) {
    const error = new Error("Product not found.");
    error.status = 404;
    throw error;
  }
  return product;
}

function validateProduct(product) {
  const price = Number(product.price);
  const discountPercent = product.discount_percent ? Number(product.discount_percent) : 0;
  const stockQuantity = Number(product.stock_quantity || 0);
  const unitGrams = product.unit_grams ? Number(product.unit_grams) : null;
  if (!product.name?.trim() || !Number.isFinite(price) || price < 0) {
    const error = new Error("A product name and a valid non-negative price are required.");
    error.status = 400;
    throw error;
  }
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    const error = new Error("Stock quantity must be a non-negative whole number.");
    error.status = 400;
    throw error;
  }
  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 95) {
    const error = new Error("Discount must be between 0 and 95 percent.");
    error.status = 400;
    throw error;
  }
  if (unitGrams !== null && (!Number.isInteger(unitGrams) || unitGrams < 1)) {
    const error = new Error("Weight per portion must be a positive whole number of grams.");
    error.status = 400;
    throw error;
  }
  return {
    ...product,
    name: product.name.trim(),
    description: product.description?.trim() || "",
    price,
    discount_percent: discountPercent,
    stock_quantity: stockQuantity,
    unit_grams: unitGrams,
    subcategory: product.subcategory?.trim() || null,
    category_id: product.category_id ? Number(product.category_id) : null,
  };
}

export async function saveProductImage(request) {
  const contentType = request.headers["content-type"]?.split(";")[0]?.trim().toLowerCase();
  const extension = imageExtensions[contentType];
  if (!extension) {
    const error = new Error("Upload a JPG, PNG, WEBP, or GIF image.");
    error.status = 400;
    throw error;
  }
  if (!Buffer.isBuffer(request.body) || request.body.length === 0) {
    const error = new Error("Choose an image file before uploading.");
    error.status = 400;
    throw error;
  }

  await fs.mkdir(uploadDirectory, { recursive: true });
  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  await fs.writeFile(path.join(uploadDirectory, fileName), request.body);
  return { image_url: `/uploads/products/${fileName}` };
}

export async function createProduct(product) {
  return insertProduct(validateProduct(product));
}

export async function updateProduct(productId, product) {
  const updatedProduct = await saveProduct(productId, validateProduct(product));
  if (!updatedProduct) {
    const error = new Error("Product not found.");
    error.status = 404;
    throw error;
  }
  return updatedProduct;
}

export async function deleteProduct(productId) {
  if (!(await removeProduct(productId))) {
    const error = new Error("Product not found.");
    error.status = 404;
    throw error;
  }
}
