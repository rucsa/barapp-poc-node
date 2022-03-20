import {getFullStoragesFromDB, getStorageItemByIdFromDB } from '../services/storage.service.js'; 

export const fetchFullStorage = async () => {
    return await getFullStoragesFromDB();
  }

export const getStorageItemById = async (id) => {
  return await getStorageItemByIdFromDB(id)
}

