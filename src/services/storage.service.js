import StorageItem from "../models/storageitem.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getFullStoragesFromDB = async () => {
    return await StorageItem.find({});
  };

export const getStorageItemByIdFromDB = async (id) => {
  return await  StorageItem.findOne({ _id: id });
}

export const updateStorageItemInDB = async (editedStorageDocument) => {
  const updateStatus = await StorageItem.findOneAndUpdate(
    { _id: editedStorageDocument._id}, editedStorageDocument, {
      new: true
    }
  );
  console.log(`Updated storage item ${updateStatus.denumire}`)
  return updateStatus
};

export const getStorageItemByProductCode = async (productCode) => {
  const storageItem = await StorageItem.find({
    "productCode": { $eq: productCode },
  });
  return storageItem
}