import { Router } from "express";
import { clearCart, getCart, removeCartItem, saveCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);

router.use(protect);
router.get("/", asyncHandler(getCart));
router.post("/", asyncHandler(saveCartItem));
router.delete("/", asyncHandler(clearCart));
router.delete("/:productId", asyncHandler(removeCartItem));

export default router;
