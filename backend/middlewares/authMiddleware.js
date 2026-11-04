import { SERVER_INSTANCE_ID } from "../config/serverInstance.js";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected route for endpoints to check whether there is token coming/valid or not
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Unauthorized User." });
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication token required." });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    if (!decode.serverInstanceId || decode.serverInstanceId !== SERVER_INSTANCE_ID) {
      return res.status(401).json({
        success: false,
        sessionExpired: true,
        message: "Session expired because server was restarted. Please log in again.",
      });
    }
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Invalid or expired token",
      error: error.message || error,
    });
  }
};

// Protected Route for Admin Access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
