import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import shoeRoutes from "./routes/shoeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/shoes", shoeRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
