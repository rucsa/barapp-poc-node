import { createNewRefillInDB, getAllRefillsFromDB, getAllRefillsCurrentSessionFromDB } from "../services/refill.service.js";
import Refill from './../models/refill.js'

export const createNewRefill = async (createdBy, beneficiaryName, newClovers, newAvailableClovers, method, sessionId) => {
  var newRef = new Refill();
  newRef.createdBy = createdBy
  newRef.createdAt = Date.now()
  newRef.beneficiaryName = beneficiaryName
  newRef.refillWith = newClovers
  newRef.totalClovers = newAvailableClovers
  newRef.donationMethod = method
  newRef.sessionId = sessionId
  return await createNewRefillInDB(newRef);
};

export const fetchAllRefills = async () => {
  return await getAllRefillsFromDB();
};

export const fetchCurrentSessionRefillVolume = async (sessionId) => {
   const refillList = await getAllRefillsCurrentSessionFromDB(sessionId);
   var total = 0
   var count = 0
   refillList.forEach((elem) => {
     total += elem.refillWith
     count += 1
   })
   return {total, count}
};
