import Refill from "./../models/refill.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const createNewRefillInDB = async (newRef) => {
  const refId = ObjectId();
  newRef._id = refId;
  const newSaved = await newRef.save().then(null, function (err) {
    throw new Error(err);
  });
  return newSaved;
};

export const getAllRefillsFromDB = async () => {
  return await Refill.find({});
};

export const getAllRefillsCurrentSessionFromDB = async (sessionId) => {
  return await Refill.find({sessionId: sessionId});
};
