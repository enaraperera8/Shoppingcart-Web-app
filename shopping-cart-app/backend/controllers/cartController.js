import * as cartService from "../services/cartService.js";

export async function getCart(request, response) {
  response.json(await cartService.getUserCart(request.user.id));
}

export async function saveCartItem(request, response) {
  const items = await cartService.setCartItem(
    request.user.id,
    request.body.productId,
    request.body.quantity,
  );
  response.status(201).json(items);
}

export async function removeCartItem(request, response) {
  response.json(await cartService.removeUserCartItem(request.user.id, request.params.productId));
}

export async function clearCart(request, response) {
  response.json(await cartService.clearUserCart(request.user.id));
}
