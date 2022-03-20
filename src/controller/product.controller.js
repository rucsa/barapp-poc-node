import {getAllProductsFromDB, getProductByIdFromDB } from '../services/product.service.js'; 

export const fetchAllProducts = async () => {
    return await getAllProductsFromDB();
  }

  export const getProductById =  async (id) => {
    return await getProductByIdFromDB(id)
  }