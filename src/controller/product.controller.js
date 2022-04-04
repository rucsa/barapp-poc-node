import {
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  createProductInDB
} from "../services/product.service.js";

export const fetchAllProducts = async () => {
  return await getAllProductsFromDB();
};

export const getProductById = async (id) => {
  return await getProductByIdFromDB(id);
};

export const createProduct = async (newProd) => {
  return await createProductInDB(newProd)
};
export const editProduct = async (id, newProd) => {
  return await updateProductInDB(id, newProd)
};