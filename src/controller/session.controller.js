import {
  isActiveSession,
  getActiveSessionFromDB,
  createNewSessionInDB,
  updateSessionInDB,
} from "../services/session.service.js";
import { getActiveSessionTicketValue } from "../services/session.service.js";
import { fetchCurrentSessionRefillVolume } from "./refill.controller.js";
import { fetchCurrentSessionTicketStatus, getColdUsersClovs, fetchAllUsersByAccess } from "./user.controller.js";
import { fetchCurrentSessionOrderStatus, getAnonymousOrders, getMemberOrders } from "./order.controller.js";

import log from "./../utils/logger.js";

export const sessionStatus = async (sessionId, username) => {
  // get users
  const admins = await fetchAllUsersByAccess('ADMIN')
  const staff = await fetchAllUsersByAccess('STAFF')
  const members = await fetchAllUsersByAccess('MEMBER')
  // get tickets
  const tickets = await fetchCurrentSessionTicketStatus();
  // get orders total value
  const orders = await fetchCurrentSessionOrderStatus(sessionId);
  // get refills
  const refills = await fetchCurrentSessionRefillVolume(sessionId);
  // get virtual
  const ticketVirtuals = await getColdUsersClovs('From Tab')
  const orderVirtuals = await getMemberOrders()
  // get ice cubes
  const ticketCubes = await getColdUsersClovs('CASH')
  const orderCubes = await getAnonymousOrders()
  log(username, `Fetching current session status`, "info");
  return { refills, tickets, orders, freezer: {
    ticketVirtuals,
    orderVirtuals,
    ticketCubes,
    orderCubes
  }, users: {
    admins, staff, members
  } };
};

export const sessionExists = async () => {
  return await isActiveSession();
};

export const getActiveSession = async () => {
  return await getActiveSessionFromDB();
};

export const getTicketValue = async (username) => {
  log(username, `Fetching ticket value`, "info");
  return await getActiveSessionTicketValue();
};

export const activateNewSession = async (sessionData, createdBy) => {
  log(createdBy, `Creating new session ${sessionData.name}`, "info");
  return await createNewSessionInDB(sessionData, createdBy);
};

export const updateActiveSession = async (sessionData, updatedBy) => {
  log(
    createdBy,
    `Updated session ${sessionData.name} - active: ${sessionData.active} - entrance value: ${sessionData.currentTicketValue}`,
    "info"
  );
  return await updateSessionInDB(sessionData, updatedBy);
};
