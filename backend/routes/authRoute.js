import express from "express";
import {
  AllUsersController,
  forgotPasswordController,
  loginController,
  registerController,
  userProfileController,
  verifyOtpController,
  resetPasswordController,
  editUserController,
  updateLicenseDetails,
  verifyLicenseDocumentController,
  sendOtpController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

//  router object
const router = express.Router();

// routing
// REGISTER '' METHOD POST
router.post("/register", registerController);

// LOGIN '' METHOD POST
router.post("/login", loginController);

// USERlOGGEDIN STATUS '' METHOD GET
router.get("/me", requireSignIn, userProfileController);

// Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//Send Otp
router.post("/send-otp", sendOtpController);

// Update license details (with automatic Driving License verification)
router.post("/update-license", requireSignIn, formidable(), updateLicenseDetails);

// Real-time Driving License document pre-check
router.post("/verify-license-doc", requireSignIn, formidable(), verifyLicenseDocumentController);

//verify otp
router.post("/verify-otp", verifyOtpController);

//reset password
router.post("/reset-Password", resetPasswordController);

router.put("/edit-user", requireSignIn, editUserController);

// Get '' METHOD GET
router.get("/getallusers", requireSignIn, isAdmin, AllUsersController);

// Protected Route Auth for Admin Dashboard
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
