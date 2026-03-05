const Cart = require("../models/Cart");
const Shoe = require("../models/Shoe");

//////////////////////////////
// GET MY CART
//////////////////////////////
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.shoe",
  );

  res.json(cart);
};

//////////////////////////////
// ADD TO CART
//////////////////////////////
exports.addToCart = async (req, res) => {
  const { shoeId, quantity, sizeChosen, colorChosen } = req.body;

  const shoe = await Shoe.findById(shoeId);
  if (!shoe) return res.status(404).json({ message: "Shoe not found" });

  if (!shoe.sizes.includes(sizeChosen))
    return res.status(400).json({ message: "Invalid size" });

  const colorValid = shoe.colors.find((c) => c.name === colorChosen);
  if (!colorValid) return res.status(400).json({ message: "Invalid color" });

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.shoe.toString() === shoeId &&
      item.sizeChosen === sizeChosen &&
      item.colorChosen === colorChosen,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ shoe: shoeId, quantity, sizeChosen, colorChosen });
  }

  await cart.save();

  res.json(cart);
};

//////////////////////////////
// UPDATE QUANTITY
//////////////////////////////
exports.updateCartItem = async (req, res) => {
  const { itemIndex, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items[itemIndex].quantity = quantity;

  await cart.save();

  res.json(cart);
};

//////////////////////////////
// REMOVE ITEM
//////////////////////////////
exports.removeCartItem = async (req, res) => {
  const { itemIndex } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items.splice(itemIndex, 1);

  await cart.save();

  res.json(cart);
};
