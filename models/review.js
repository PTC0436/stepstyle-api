import mongoose from "mongoose";

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
      min: 0,
      max: 5,
      set: (value) => {
        if (typeof value !== "number") return value;

        // giới hạn trong khoảng 0 - 5
        const clamped = Math.max(0, Math.min(5, value));

        // làm tròn về bội số 0.5 gần nhất
        return Math.round(clamped * 2) / 2;
      },
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

//////////////////////////
// HIDE __v field
//////////////////////////
reviewSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
