const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, reviewController.createReview);
router.get("/shoe/:shoeId", reviewController.getReviewsByShoe);
router.delete("/:reviewId", protect, reviewController.deleteReview);

module.exports = router;
