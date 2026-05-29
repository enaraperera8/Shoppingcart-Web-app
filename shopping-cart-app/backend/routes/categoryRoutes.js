import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);

router.get("/", asyncHandler(getCategories));
router.post("/", protect, adminOnly, asyncHandler(createCategory));
router.put("/:id", protect, adminOnly, asyncHandler(updateCategory));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCategory));

export default router;
