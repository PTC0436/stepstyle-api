import Review from "../models/review.js";

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
