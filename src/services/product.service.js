import Product from "../models/product.js";
import { getStorageItemByProductCode } from "./storage.service.js";
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

export const updateProductQtyAtStorageUpdate = async (storageItem) => {
  const products = await Product.find({
    "mix.productCode": { $eq: storageItem.productCode },
  });
  console.log(
    `Found products used used by recently updated storage item ${storageItem.denumire}`
  );

  console.log(products);
  for (let product of products) {
    // decide which item from recipt has less total ml
    let minAvailabilePortions = Number.MAX_VALUE;
    for (let mixItem of product.mix) {
      const usedItem = await getStorageItemByProductCode(mixItem.productCode);
      console.log("found product by code " + mixItem.productCode);
      console.log(
        `maxAvailablePortions = ${usedItem[0].size} * ${usedItem[0].qty} / ${mixItem.portie}`
      );
      const maxAvailablePortions =
        (usedItem[0].size * usedItem[0].qty) / mixItem.portie;
      console.log(
        `We have ${maxAvailablePortions} portions of ${mixItem.productCode}`
      );
      if (minAvailabilePortions > maxAvailablePortions) {
        minAvailabilePortions = maxAvailablePortions;
      }
    }

    console.log(
      `Updating qty for ${product.denumire} with ${minAvailabilePortions}`
    );
    try {
      product.currentQty = minAvailabilePortions;
      await Product.findOneAndUpdate({ _id: product._id }, product, {
        new: true,
      });
      console.log(`Finished updating product item ${product.denumire}`);
    } catch (error) {
      console.log(error);
    }
  }
  return true;
};
