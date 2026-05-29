import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  uploadProductImage,
  updateProduct,
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import express from "express";

const router = Router();
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);

router.get("/", asyncHandler(getProducts));
router.post(
  "/image-upload",
  protect,
  adminOnly,
  express.raw({ limit: "5mb", type: ["image/jpeg", "image/png", "image/webp", "image/gif"] }),
  asyncHandler(uploadProductImage),
);
router.get("/:id", asyncHandler(getProduct));
router.post("/", protect, adminOnly, asyncHandler(createProduct));
router.put("/:id", protect, adminOnly, asyncHandler(updateProduct));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteProduct));

export default router;
