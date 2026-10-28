import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import Razorpay from "razorpay";
import path from "path";
import { fileURLToPath } from "url";

// Global resilience handlers to avoid crashing on worker thread or network errors
process.on("uncaughtException", (err) => {
  console.error("Critical Uncaught Exception:", err?.message || err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Critical Unhandled Rejection:", reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure env with absolute path to backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

import ConnectDb from "./config/ConnectDb.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import bikeRoutes from "./routes/bikeRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import contactRoutes from "./routes/contactRoutes.js";

// database config
ConnectDb();

// Unique server instance ID that changes every time server starts
export const SERVER_INSTANCE_ID = Date.now().toString();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Normalize duplicate slashes in request URLs to prevent 404 on //api/...
app.use((req, res, next) => {
  req.url = req.url.replace(/\/{2,}/g, "/");
  next();
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/bike", bikeRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1", paymentRoute);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/contact", contactRoutes);

// Server instance endpoint to detect terminal restarts
app.get("/api/v1/auth/server-instance", (req, res) => {
  res.status(200).json({ instanceId: SERVER_INSTANCE_ID });
});

//  rest api
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to this website",
  });
});

const PORT = process.env.PORT || 5001;

// run listen
app.listen(PORT, () => {
  console.log(
    `Server running on mode ${process.env.DEV_MODE || "development"} on ${PORT}`.bgWhite.black
  );
});

// razor pay
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_API_SECRET || "placeholder",
});
