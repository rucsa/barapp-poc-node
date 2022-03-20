import StorageItem from "../models/storageitem.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getFullStoragesFromDB = async () => {
    return await StorageItem.find({});
  };

export const getStorageItemByIdFromDB = async (id) => {
  return await  StorageItem.findOne({ _id: id });
}