import {
  isActiveSession,
  getActiveSessionFromDB,
  createNewSessionInDB,
  updateSessionInDB,
} from "../services/session.service.js";
import { getActiveSessionTicketValue } from "../services/session.service.js";
import { fetchCurrentSessionRefillVolume } from "./refill.controller.js";
import { fetchCurrentSessionTicketStatus } from "./user.controller.js";
import { fetchCurrentSessionOrderStatus} from './order.controller.js'

export const sessionStatus = async (sessionId) => {
  // get tickets
  const tickets = await fetchCurrentSessionTicketStatus();
  // get orders total value
const orders = await fetchCurrentSessionOrderStatus(sessionId)
  // get refills
  const refills = await fetchCurrentSessionRefillVolume(sessionId);
  return { refills, tickets, orders };
};

export const sessionExists = async () => {
  return await isActiveSession();
};

export const getActiveSession = async () => {
  return await getActiveSessionFromDB();
};

export const getTicketValue = async () => {
  return await getActiveSessionTicketValue();
};

export const activateNewSession = async (sessionData, createdBy) => {
  return await createNewSessionInDB(sessionData, createdBy);
};

export const updateActiveSession = async (sessionData, updatedBy) => {
  return await updateSessionInDB(sessionData, updatedBy);
};
