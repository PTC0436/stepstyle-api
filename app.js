import express from "express";
import authRoutes from "./routes/authRoutes.js";
import shoeRoutes from "./routes/shoeRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/shoes", shoeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
