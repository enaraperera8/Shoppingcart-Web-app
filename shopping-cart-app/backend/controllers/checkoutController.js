import { getCheckoutSummary as createSummary } from "../services/cartService.js";

export async function getCheckoutSummary(request, response) {
  response.json(await createSummary(request.user.id));
}
