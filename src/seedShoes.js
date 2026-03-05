import mongoose from "mongoose";
import { shoes } from "./data/shoes.js";
import Shoe from "./models/shoe.js";
import dotenv from "dotenv";
import dns from "dns";
dotenv.config();

// đổi DNS resolver
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const seedShoes = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const data = shoes.map((shoe) => {
    const { id, reviews, ...rest } = shoe;
    rest.rating = 0;
    return rest;
  });

  console.log(data);

  await Shoe.insertMany(data);

  console.log("Shoes imported");
  process.exit();
};

seedShoes();
