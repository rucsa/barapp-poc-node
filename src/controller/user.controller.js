import { getUserByIdFromDb, updateUserBalance, payUserEntrance } from '../services/user.service.js'; 
import { createUserInDb, getAllUsersFromDB } from '../services/user.service.js'; 

export const getUserById = async (id) => {
  return await getUserByIdFromDb(id); 
}

export const fetchAllUsers = async () => {
  return await getAllUsersFromDB();
}

export const userTicketPayment = async (id) => {
  const user = await getUserByIdFromDb(id); 
  const newAvailableClovers = Number(user.availableClovers) - 30
  const updatedClovers = await payUserEntrance(id, newAvailableClovers)
  return updatedClovers
}

export const refillUser = async (id, newClovers) => {
  const user = await getUserByIdFromDb(id); 
  const newAvailableClovers = Number(user.availableClovers) + Number(newClovers)
  const updatedClovers = await updateUserBalance(id, newAvailableClovers)
  return updatedClovers
}

export const registerNewOrder = async (id, total) => {
  const user = await getUserByIdFromDb(id); 
  const newAvailableClovers = Number(user.availableClovers) - Number(total)
  const updatedClovers = await updateUserBalance(id, newAvailableClovers)
  return updatedClovers
}

export const registerUser = async (newUserData) => { 
  const user = await createUserInDb(newUserData); 
  return user
}