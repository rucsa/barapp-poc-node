import {
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  createProductInDB
} from "../services/product.service.js";
import log from './../utils/logger.js'

export const fetchAllProducts = async (username) => {
  log(username, `Fetching all products`, 'info')
  return await getAllProductsFromDB();
};

export const getProductById = async (id, username) => {
  log(username, `Fetching product ${id}`, 'info')
  return await getProductByIdFromDB(id);
};

export const createProduct = async (newProd, username) => {
  log(username, `Creating product ${newProd.denumire} with clovers ${newProd.clovers}`, 'info')
  return await createProductInDB(newProd)
};
export const editProduct = async (id, newProd, username) => {
  log(username, `Updating product ${newProd.denumire} with clovers ${newProd.clovers}`, 'info')
  return await updateProductInDB(id, newProd)
};