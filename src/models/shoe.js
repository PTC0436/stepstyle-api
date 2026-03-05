import mongoose from "mongoose";

//////////////////////////
// COLOR SUB-SCHEMA
//////////////////////////
const colorSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
  },
  { _id: false },
);

//////////////////////////
// MAIN SHOE SCHEMA
//////////////////////////
const shoeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    brand: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      default: "Unisex",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "VND",
    },

    thumbnail: String,

    images: [String],

    colors: [colorSchema],

    sizes: [Number],

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    description: String,

    material: String,

    weight: Number,

    origin: String,

    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

//////////////////////////
// TEXT SEARCH
//////////////////////////
shoeSchema.index({ name: "text", brand: "text", tags: "text" });

//////////////////////////
// AUTO FILTER SOFT DELETE
//////////////////////////
shoeSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: false });
  next();
});

const Shoe = mongoose.model("Shoe", shoeSchema);
export default Shoe;
