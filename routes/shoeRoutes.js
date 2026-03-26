import express from "express";
import {
  getShoes,
  getShoeById,
  getBrandList,
  getGenderList,
  getTagList,
  getSimilarShoes,
} from "../controllers/shoeController.js";

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

export default router;
