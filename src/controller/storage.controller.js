import {
  getFullStoragesFromDB,
  getStorageItemByIdFromDB,
  updateStorageItemInDB,
  getStorageItemByProductCode,
  createStorageItemInDB,
} from "../services/storage.service.js";
import { updateProductQtyAtStorageUpdate } from "../services/product.service.js";

import log from "./../utils/logger.js";

export const fetchFullStorage = async (username) => {
  log(username, `Fetching storage`, "info");
  return await getFullStoragesFromDB();
};

export const getStorageItemById = async (id, username) => {
  log(username, `Fetching storage item ${id}`, "info");
  return await getStorageItemByIdFromDB(id);
};

export const createStorageItem = async (itemData, username) => {
  log(
    username,
    `Creating storage item ${itemData.denumire} with size ${itemData.size}, portion ${itemData.portion} and qty ${itemData.qty} `,
    "info"
  );
  return await createStorageItemInDB(itemData);
};

export const updateStorageItem = async (editedStorageItem, username) => {
  try {
    log(
      username,
      `Updating storage item ${editedStorageItem.denumire} with size ${editedStorageItem.size} and qty ${editedStorageItem.qty} `,
      "info"
    );
    const newItem = await updateStorageItemInDB(editedStorageItem);
    try {
      return await updateProductQtyAtStorageUpdate(newItem, username);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};

export const substractOrderFromStorage = async (content, username) => {
  try {
    for (let element of content) {
      const glasses = element.count;
      for (let item of element.mix) {
        const storageItem = (
          await getStorageItemByProductCode(item.productCode)
        )[0];

        const newStorageQty =
          (storageItem.size * storageItem.qty - item.portie * glasses) /
          storageItem.size;
        log(
          username,
          `Updating storage item ${storageItem.denumire} with initial qty ${storageItem.qty} to new qty ${newStorageQty}`,
          "info"
        );
        storageItem.qty = newStorageQty;
        const newStorageItem = await updateStorageItemInDB(storageItem);
        await updateProductQtyAtStorageUpdate(
          newStorageItem, username
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};
