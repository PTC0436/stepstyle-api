import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cart.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:itemId", updateCartItem);

router.delete("/:itemId", removeCartItem);

export default router;
