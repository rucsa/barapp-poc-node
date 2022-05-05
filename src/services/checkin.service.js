import Checkin from "../models/checkin.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import log from "../utils/logger.js";
export const getUserCurrentCheckin = async (username, sessionId) => {
  const ckeckin = await Checkin.find({
    username: username,
    sessionId: sessionId,
  }).exec();
  if (ckeckin.length === 0) return null;
  else return ckeckin[0];
};

export const createNewCheckin = async (user, sessionId) => {
  log("", "Creating new checkin");
  var newEntrance = new Checkin();
  const entranceId = ObjectId();
  newEntrance._id = entranceId;
  newEntrance.createdAt = Date.now();
  newEntrance.ticketDonationValue = null;
  newEntrance.donationMethod = null;
  newEntrance.hasTicket = false;
  newEntrance.createdBy = "";
  newEntrance.sessionId = sessionId;
  newEntrance.username = user.username;
  newEntrance.lastUpdatedAt = null;
  const checkin = await Checkin.save().then(null, function (err) {
    throw new Error(err);
  });
  console.log(checkin);
  return newEntrance;
};
