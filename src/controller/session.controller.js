import { isActiveSession, getActiveSessionFromDB, createNewSessionInDB, updateSessionInDB } from "../services/session.service.js";

export const sessionExists = async () => {
  return await isActiveSession();
};

export const getActiveSession = async() => {
  return await getActiveSessionFromDB();
}

export const activateNewSession = async (sessionData) => {
  return await createNewSessionInDB(sessionData);
}

export const updateActiveSession = async (sessionData) => {
  return await updateSessionInDB(sessionData);
}
