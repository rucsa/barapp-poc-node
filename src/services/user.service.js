import User from "../models/user.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getAllUsersFromDB = async () => {
  return await User.find({});
};

export const getUserByIdFromDb = async (id) => {
  return await User.findOne({ _id: id });
};

export const getUserByUsernameFromDb = async (username) => {
  const user = await User.findOne({ username: username });
  return user
};

export const updateUserBalance = async (id, newCLovers) => {
  const refillStatus = await User.findOneAndUpdate(
    { _id: id},
    { availableClovers: newCLovers }, {
        new: true 
    }
  );
  return refillStatus.availableClovers
};

export const payUserEntrance = async (id, newCLovers) => {
  const refillStatus = await User.findOneAndUpdate(
    { _id: id},
    { availableClovers: newCLovers, payedTicketThisSession: true }, {
        new: true 
    }
  );
  return refillStatus.availableClovers
};



export const createUserInDb = async (user) => {
  var newUser = new User(user);
  const userId = ObjectId()
  newUser.createdAt = Date.now()
  newUser.payedTicketThisSession = false
  newUser._id = userId
  const userSaved = await newUser.save().then(null, function (err) { 
    throw new Error(err); 
  });
  return userSaved._id;
};
