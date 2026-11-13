import express from "express";
import {
  AllUsersController,
  forgotPasswordController,
  loginController,
  googleLoginController,
  registerController,
  userProfileController,
  verifyOtpController,
  resetPasswordController,
  editUserController,
  getUserByIdController,
  deleteUserController,
  updateLicenseDetails,
  verifyLicenseDocumentController,
  sendOtpController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import userModel from "../models/userModel.js";

// Middleware to parse multipart/form-data when present, allowing application/json through
const conditionalFormidable = (req, res, next) => {
  const contentType = (req.headers["content-type"] || "").toLowerCase();
  if (contentType.includes("multipart/form-data")) {
    return formidable()(req, res, next);
  }
  next();
};

//  router object
const router = express.Router();

// routing
// REGISTER '' METHOD POST
router.post("/register", conditionalFormidable, registerController);

// LOGIN '' METHOD POST
router.post("/login", loginController);

// GOOGLE LOGIN '' METHOD POST
router.post("/google-login", googleLoginController);

// GOOGLE CLIENT ID '' METHOD GET
router.get("/google-client-id", (req, res) =>
  res.status(200).send({ clientId: process.env.GOOGLE_CLIENT_ID || "" })
);

// USERlOGGEDIN STATUS '' METHOD GET
router.get("/me", requireSignIn, userProfileController);

// Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//Send Otp
router.post("/send-otp", sendOtpController);

// Update license details (with automatic Driving License verification)
router.post("/update-license", requireSignIn, conditionalFormidable, updateLicenseDetails);

// Fetch user license document/photo
router.get("/user-license/:userId", requireSignIn, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId.toString() && req.user.role !== 1) {
      return res.status(403).send({ message: "Unauthorized access to document" });
    }
    const user = await userModel.findById(req.params.userId).select("licenseFile");
    if (!user || !user.licenseFile || !user.licenseFile.data) {
      return res.status(404).send({ message: "No license document found" });
    }
    res.set("Content-Type", user.licenseFile.contentType || "application/pdf");
    res.set("Content-Disposition", "inline");
    return res.status(200).send(user.licenseFile.data);
  } catch (error) {
    res.status(500).send({ message: "Error fetching license", error: error.message });
  }
});

// Real-time Driving License document pre-check
router.post("/verify-license-doc", requireSignIn, formidable(), verifyLicenseDocumentController);

//verify otp
router.post("/verify-otp", verifyOtpController);

//reset password
router.post("/reset-Password", resetPasswordController);

router.put("/edit-user", requireSignIn, editUserController);

// Get User by ID
router.get("/user/:id", requireSignIn, getUserByIdController);
router.get("/user-by-id/:id", requireSignIn, getUserByIdController);

// Delete User (Admin only)
router.delete("/delete-user/:id", requireSignIn, isAdmin, deleteUserController);

// Get '' METHOD GET
router.get("/getallusers", requireSignIn, isAdmin, AllUsersController);

// Protected Route Auth for Admin Dashboard
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
