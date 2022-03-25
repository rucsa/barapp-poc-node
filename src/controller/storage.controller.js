import {
  getFullStoragesFromDB,
  getStorageItemByIdFromDB,
  updateStorageItemInDB,
} from "../services/storage.service.js";
import { updateProductQtyAtStorageUpdate } from "../services/product.service.js";
export const fetchFullStorage = async () => {
  return await getFullStoragesFromDB();
};

export const getStorageItemById = async (id) => {
  return await getStorageItemByIdFromDB(id);
};

export const updateStorageItem = async (editedStorageItem) => {
  try {
    const newItem = await updateStorageItemInDB(editedStorageItem);
    try {
      await updateProductQtyAtStorageUpdate(newItem);
    } catch (e) {
      console.log(e);
    }
    return newItem;
  } catch (e) {
    console.log(e);
  }
};
