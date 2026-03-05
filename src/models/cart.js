const mongoose = require("mongoose");

//////////////////////////
// CART ITEM SUB-SCHEMA
//////////////////////////
const cartItemSchema = new mongoose.Schema(
  {
    shoe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoe",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    sizeChosen: {
      type: Number,
      required: true,
    },

    colorChosen: {
      type: String, // lưu tên màu (VD: "White")
      required: true,
    },
  },
  { _id: false },
);

//////////////////////////
// CART SCHEMA
//////////////////////////
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Cart", cartSchema);
