import Product from "../models/product.js";
import { getStorageItemByProductCode } from "./storage.service.js";

import log from "./../utils/logger.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const createProductInDB = async (prodData) => {
  var newProd = new Product(prodData);
  const productId = ObjectId()
  newProd._id = productId
  const prodSaved = await newProd.save().then(null, function (err) { 
    throw new Error(err); 
  });
  return prodSaved;
};

export const getAllProductsFromDB = async () => {
  return await Product.find({});
};

export const getProductByIdFromDB = async (id) => {
  return await Product.findOne({ _id: id });
};

export const updateProductInDB = async (id, newProd) => {
  try {
    return await Product.findOneAndUpdate({ _id: id }, newProd, {
      new: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateProductQtyAtStorageUpdate = async (storageItem, username) => {
  const products = await Product.find({
    "mix.productCode": { $eq: storageItem.productCode },
  });
  log(
    username,
    `Triggering product update used by ${storageItem.denumire}: ${products.map(a => a.denumire)}`,
    "info"
  );
  for (let product of products) {
    // decide which item from recipt has less total ml
    let minAvailabilePortions = Number.MAX_VALUE;
    for (let mixItem of product.mix) {
      const usedItem = await getStorageItemByProductCode(mixItem.productCode);
      const maxAvailablePortions =
        (usedItem[0].size * usedItem[0].qty) / mixItem.portie;
      
      if (minAvailabilePortions > maxAvailablePortions) {
        minAvailabilePortions = maxAvailablePortions;
      }
    }

    try {
      log(username, 
        `Updating qty for product ${product.denumire} from ${ product.currentQty } portions to ${minAvailabilePortions} portions`
      );
      product.currentQty = minAvailabilePortions;
      await Product.findOneAndUpdate({ _id: product._id }, product, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return true;
};
