import Shoe from "../models/shoe.js";

/*
GET /api/shoes
search + filter + sort + pagination
*/
export const getShoes = async (req, res) => {
  try {
    const {
      brand,
      gender,
      search,
      tags,
      priceMin,
      priceMax,
      sort,
      order = "asc",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // brand
    if (brand) {
      filter.brand = new RegExp(`^${brand}$`, "i");
    }

    // gender
    if (gender) {
      filter.gender = gender;
    }

    // tags
    if (tags) {
      const tagList = tags.split(",");
      filter.tags = { $all: tagList };
    }

    // price
    if (priceMin || priceMax) {
      filter.salePrice = {};
      if (priceMin) filter.salePrice.$gte = Number(priceMin);
      if (priceMax) filter.salePrice.$lte = Number(priceMax);
    }

    // search name
    if (search) {
      const keywords = search.split(" ");
      filter.$and = keywords.map((k) => ({
        name: { $regex: k, $options: "i" },
      }));
    }

    // sort
    const sortOption = {};
    if (sort) {
      sortOption[sort] = order === "asc" ? 1 : -1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const shoes = await Shoe.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Shoe.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: shoes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
GET /api/shoes/:id
*/
export const getShoeById = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    res.json(shoe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
POST /api/shoes
*/
export const createShoe = async (req, res) => {
  try {
    const shoe = new Shoe(req.body);
    await shoe.save();

    res.status(201).json(shoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/*
PUT /api/shoes/:id
*/
export const updateShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    res.json(shoe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/*
DELETE /api/shoes/:id
*/
export const deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);

    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    res.json({ message: "Shoe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
GET brand list
*/
export const getBrandList = async (req, res) => {
  try {
    const brands = await Shoe.distinct("brand");
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
GET gender list
*/
export const getGenderList = async (req, res) => {
  try {
    const genders = await Shoe.distinct("gender");
    res.json(genders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
GET tag list
*/
export const getTagList = async (req, res) => {
  try {
    const tags = await Shoe.distinct("tags");
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
