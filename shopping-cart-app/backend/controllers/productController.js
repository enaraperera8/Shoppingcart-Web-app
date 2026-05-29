import * as productService from "../services/productService.js";

export async function getProducts(request, response) {
  response.json(await productService.listProducts(request.query));
}

export async function getProduct(request, response) {
  response.json(await productService.getProduct(request.params.id));
}

export async function createProduct(request, response) {
  response.status(201).json(await productService.createProduct(request.body));
}

export async function uploadProductImage(request, response) {
  response.status(201).json(await productService.saveProductImage(request));
}

export async function updateProduct(request, response) {
  response.json(await productService.updateProduct(request.params.id, request.body));
}

export async function deleteProduct(request, response) {
  await productService.deleteProduct(request.params.id);
  response.status(204).send();
}
