import Product from "../models/product.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getAllProductsFromDB = async () => {
  return await Product.find({});
};

export const getProductByIdFromDB = async (id) => {
  return await Product.findOne({ _id: id });
};
