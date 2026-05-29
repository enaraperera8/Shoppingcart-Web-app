import { Router } from "express";
import { getCheckoutSummary } from "../controllers/checkoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);

router.get("/summary", protect, asyncHandler(getCheckoutSummary));

export default router;
