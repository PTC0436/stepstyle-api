const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    shoe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoe",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

//////////////////////////////
// 1 USER CHỈ REVIEW 1 LẦN / SHOE
//////////////////////////////
reviewSchema.index({ shoe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
