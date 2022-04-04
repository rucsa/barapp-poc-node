import Session from "../models/session.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const isActiveSession = async () => {
  const activeSessions = await Session.find({ active: true }).exec();
  if (activeSessions.length === 0) return false;
  if (activeSessions.length > 1) return "error";
  else return true;
};

export const getActiveSessionFromDB = async () => {
  const activeSessions = await Session.find({ active: true })
    .sort({ createdAt: -1 })
    .exec();
  if (activeSessions.length === 0) return null;
  else return activeSessions[0];
};

export const getActiveSessionTicketValue = async () => {
  const activeSessions = await Session.find({ active: true })
    .sort({ createdAt: -1 })
    .exec();
  if (activeSessions.length === 0) return null;
  else return activeSessions[0].currentTicketValue;
};

export const createNewSessionInDB = async (sessionData, createdBy) => {
  var newSession = new Session(sessionData);
  const sessionId = ObjectId();
  newSession._id = sessionId;
  newSession.createdAt = Date.now();
  newSession.createdBy = createdBy;

  var expirationDate = new Date();
  expirationDate.setTime(Date.now() + 30 * 60 * 60 * 1000);
  newSession.expiresAt = expirationDate;
  newSession.updates = []
  newSession.active = true;
  const sessionCreated = await newSession.save().then(null, function (err) {
    throw new Error(err);
  });
  return newSession;
};

export const updateSessionInDB = async (sessionData, updatedBy) => {

  // extract current session info
  const activeSessions = await Session.find({ active: true })
    .sort({ createdAt: -1 })
    .exec();
  if (activeSessions.length === 0) return null;

  const session = activeSessions[0]
  console.log(session)
  const currentTicketValue = session.currentTicketValue

  // record update history
  const updateList = session.updates;
  updateList.push({
    updatedAt: Date.now(),
    updatedBy: updatedBy,
    previousTicketValue: currentTicketValue,
    newTicketValue: sessionData.currentTicketValue,
  });

  // update session
  session.currentTicketValue = sessionData.currentTicketValue
  session.updates = updateList;
  const updateStatus = await Session.findOneAndUpdate(
    { active: true },
    session,
    {
      new: true,
    }
  );
  return session
};

