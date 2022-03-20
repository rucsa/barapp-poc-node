import Session from "../models/session.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const isActiveSession = async () => {
  const activeSessions = await Session.find({ active: true }).exec();
  if (activeSessions.length === 0) return false;
  if (activeSessions.length > 1) return 'error';
  else return true
};

export const getActiveSessionFromDB = async () => {
    const activeSessions = await Session.find({ active: true }).sort({createdAt: -1}).exec();
    if (activeSessions.length === 0) return null;
    else return activeSessions[0]
  };

export const createNewSessionInDB = async (sessionData) => {
    var newSession = new Session(sessionData);
    const sessionId = ObjectId()
    newSession._id = sessionId
    newSession.createdAt = Date.now()

    var expirationDate = new Date()
    expirationDate.setTime( Date.now() + (30 * 60 * 60 * 1000)); 
    newSession.expiresAt = expirationDate

    newSession.active = true
    const sessionCreated = await newSession.save().then(null, function (err) { 
        throw new Error(err); 
      });
    return newSession
}

export const updateSessionInDB = async (sessionData) => {
    const updateStatus = await Session.findOneAndUpdate(
        { active: true},
        sessionData, {
            new: true 
        }
      );
      return sessionData
}
