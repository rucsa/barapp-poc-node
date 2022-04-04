import {
  getFullStoragesFromDB,
  getStorageItemByIdFromDB,
  updateStorageItemInDB,
  getStorageItemByProductCode,
  createStorageItemInDB,
} from "../services/storage.service.js";

import { updateProductQtyAtStorageUpdate } from "../services/product.service.js";
export const fetchFullStorage = async () => {
  return await getFullStoragesFromDB();
};

export const getStorageItemById = async (id) => {
  return await getStorageItemByIdFromDB(id);
};

export const createStorageItem = async (itemData) => {
  return await createStorageItemInDB(itemData);
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

export const substractOrderFromStorage = async (content) => {
  try {
    for (let element of content) {
      const glasses = element.count;
      for (let item of element.mix) {
        const storageItem = (
          await getStorageItemByProductCode(item.productCode)
        )[0];
        console.log(
          `Updating storage item ${storageItem.denumire} with initial qty ${storageItem.qty}`
        );
        const newStorageQty =
          (storageItem.size * storageItem.qty - item.portie * glasses) /
          storageItem.size;
        storageItem.qty = newStorageQty;
        console.log(`With new qty ${storageItem.qty}`);
        const newStorageItem = await updateStorageItemInDB(storageItem);
        const productUpdated = await updateProductQtyAtStorageUpdate(
          newStorageItem
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};
