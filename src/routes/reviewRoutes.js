import express from "express";
import {
  createReview,
  getReviewsByShoe,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/shoe/:shoeId", getReviewsByShoe);
router.delete("/:reviewId", protect, deleteReview);

export default router;
