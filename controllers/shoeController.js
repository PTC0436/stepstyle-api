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
      filter.$text = { $search: search };
    }

    // sort
    const sortOption =
      sort && sort.trim() !== "" ? { [sort]: order === "asc" ? 1 : -1 } : {};

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;

    const skip = (pageNum - 1) * limitNum;

    let shoes;

    if (search) {
      shoes = await Shoe.find(filter, { score: { $meta: "textScore" } })
        .select(
          "_id name brand price salePrice currency thumbnail ratingAverage ratingCount",
        )
        .sort({ ...sortOption, score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limitNum)
        .lean();
    } else {
      shoes = await Shoe.find(filter)
        .select(
          "_id name brand price salePrice currency thumbnail ratingAverage ratingCount",
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean();
    }

    const total = await Shoe.countDocuments(filter);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: shoes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
GET /api/shoes/:id/similar
*/
export const getSimilarShoes = async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 4; // mặc định 4

  const shoe = await Shoe.findById(id);

  if (!shoe) {
    return res.status(404).json({ message: "Product not found" });
  }
  const similarShoes = await Shoe.aggregate([
    {
      $match: {
        _id: { $ne: shoe._id },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $cond: [{ $eq: ["$brand", shoe.brand] }, 3, 0] },
            {
              $cond: [
                {
                  $and: [
                    { $gte: ["$salePrice", shoe.salePrice * 0.7] },
                    { $lte: ["$salePrice", shoe.salePrice * 1.3] },
                  ],
                },
                1,
                0,
              ],
            },
            {
              $size: {
                $setIntersection: ["$tags", shoe.tags],
              },
            },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit * 2 },
    { $sample: { size: limit } },
    {
      $project: {
        id: "$_id",
        _id: 0,
        name: 1,
        brand: 1,
        price: 1,
        salePrice: 1,
        currency: 1,
        thumbnail: 1,
        ratingAverage: 1,
        ratingCount: 1,
      },
    },
  ]);

  res.json(similarShoes);
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
