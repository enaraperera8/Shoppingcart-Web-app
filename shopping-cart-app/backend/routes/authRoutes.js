import { Router } from "express";
import {
  adminLogin,
  adminRegister,
  facebookLogin,
  googleLogin,
  login,
  passkeyLoginOptions,
  passkeyLoginVerify,
  passkeyRegisterOptions,
  passkeyRegisterVerify,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/admin/login", asyncHandler(adminLogin));
router.post("/admin/register", asyncHandler(adminRegister));
router.post("/google", asyncHandler(googleLogin));
router.post("/facebook", asyncHandler(facebookLogin));
router.post("/passkey/register/options", protect, asyncHandler(passkeyRegisterOptions));
router.post("/passkey/register/verify", protect, asyncHandler(passkeyRegisterVerify));
router.post("/passkey/login/options", asyncHandler(passkeyLoginOptions));
router.post("/passkey/login/verify", asyncHandler(passkeyLoginVerify));

export default router;
