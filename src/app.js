import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Running..." });
});

export default app;
