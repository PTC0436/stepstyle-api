import express from "express";
import { getReviewsByShoe } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/shoe/:shoeId", getReviewsByShoe);

export default router;
