import Review from "../models/review.js";
import Shoe from "../models/shoe.js";
import mongoose from "mongoose";

//////////////////////////////
// UPDATE SHOE RATING
//////////////////////////////
const updateShoeRating = async (shoeId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        shoe: new mongoose.Types.ObjectId(shoeId),
      },
    },
    {
      $group: {
        _id: "$shoe",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingAverage = Math.round((stats[0]?.avgRating || 0) * 2) / 2;

  const ratingCount = stats[0]?.count || 0;

  await Shoe.findByIdAndUpdate(shoeId, {
    ratingAverage,
    ratingCount,
  });
};

//////////////////////////////
// CREATE REVIEW
//////////////////////////////
export const createReview = async (req, res) => {
  try {
    const { shoeId, rating, content } = req.body;

    const shoe = await Shoe.findById(shoeId);

    if (!shoe) {
      return res.status(404).json({
        message: "Shoe not found",
      });
    }

    const existingReview = await Review.findOne({
      shoe: shoeId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this shoe",
      });
    }

    const review = await Review.create({
      shoe: shoeId,
      user: req.user._id,
      rating,
      content,
    });

    await review.populate("user", "name");

    await updateShoeRating(shoeId);

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//////////////////////////////
// GET REVIEWS BY SHOE
//////////////////////////////
export const getReviewsByShoe = async (req, res) => {
  try {
    const reviews = await Review.find({
      shoe: req.params.shoeId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////
// DELETE REVIEW
//////////////////////////////
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    await review.deleteOne();

    await updateShoeRating(review.shoe);

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
