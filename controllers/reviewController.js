import Review from "../models/review.js";
import Shoe from "../models/shoe.js";

//////////////////////////////
// CREATE REVIEW
//////////////////////////////
export const createReview = async (req, res) => {
  try {
    const { shoeId, rating, content } = req.body;

    const review = await Review.create({
      shoe: shoeId,
      user: req.user._id,
      rating,
      content,
    });

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
  const reviews = await Review.find({ shoe: req.params.shoeId }).populate(
    "user",
    "name",
  );

  res.json(reviews);
};

//////////////////////////////
// DELETE REVIEW
//////////////////////////////
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  await review.deleteOne();

  await updateShoeRating(review.shoe);

  res.json({ message: "Review deleted" });
};

const updateShoeRating = async (shoeId) => {
  const stats = await Review.aggregate([
    { $match: { shoe: shoeId } },
    {
      $group: {
        _id: "$shoe",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Shoe.findByIdAndUpdate(shoeId, {
    rating: stats[0]?.avgRating || 0,
    numReviews: stats[0]?.count || 0,
  });
};
