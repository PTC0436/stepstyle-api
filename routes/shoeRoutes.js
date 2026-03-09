import express from "express";
import {
  getShoes,
  getShoeById,
  createShoe,
  updateShoe,
  deleteShoe,
  getBrandList,
  getGenderList,
  getTagList,
  getSimilarShoes,
} from "../controllers/shoeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// list + search + filter
router.get("/", getShoes);

// filter lists
router.get("/brands", getBrandList);
router.get("/genders", getGenderList);
router.get("/tags", getTagList);

// single shoe
router.get("/:id", getShoeById);

//similarShoes
router.get("/:id/similar", getSimilarShoes);

// admin CRUD
router.post("/", protect, adminOnly, createShoe);
router.put("/:id", protect, adminOnly, updateShoe);
router.delete("/:id", protect, adminOnly, deleteShoe);

export default router;
