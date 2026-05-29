import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/uploads", express.static(path.join(currentDirectory, "uploads")));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use("/api", (_request, response) => {
  response.status(404).json({ message: "API endpoint not found." });
});

app.use(errorHandler);

export default app;
