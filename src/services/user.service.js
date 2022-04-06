import User from "../models/user.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getUserByEmail = async (userEmail) => {
  const user = await User.find({ email: { $eq: userEmail } }).exec();
  if (user.length !== 1) {// error
  }
  return user[0];
};

export const isUsernameUnique = async (name) => {
  const user = await User.find({ username: { $eq: name } }).exec();
  return user.length === 0
};

export const isEmailUnique = async (userEmail) => {
  const user = await User.find({ email: { $eq: userEmail } }).exec();
  return user.length === 0
};

export const isPhoneUnique = async (phone) => {
  const user = await User.find({ phone: { $eq: phone } }).exec();
  return user.length === 0
};

export const addPassChangeCodeToUser = async (id, code) => {
  await User.findOneAndUpdate(
    { _id: id },
    { changePassRequestCode: code },
    {
      new: true,
    }
  );
  return true
}

export const changePassForUser = async (id, newPass) => {
  await User.findOneAndUpdate(
    { _id: id },
    { password: newPass, changePassRequestCode: null },
    {
      new: true,
    }
  );
  return true
}

export const validateUniqueUsername = async (username) => {
  const usernameList = await User.find({ username: username });
  console.log(usernameList);
};

export const getMembers = async () => {
  return await User.find({ accessLevel: "MEMBER" });
};

export const getAllUsersFromDB = async () => {
  return await User.find({});
};

export const getUserByIdFromDb = async (id) => {
  return await User.findOne({ _id: id });
};

export const getUserByUsernameFromDb = async (username) => {
  const user = await User.findOne({ username: username });
  return user;
};

export const updateUserBalance = async (id, newCLovers) => {
  const now = Date.now();
  const refillStatus = await User.findOneAndUpdate(
    { _id: id },
    { availableClovers: newCLovers, lastUpdatedAt: now },
    {
      new: true,
    }
  );
  return refillStatus.availableClovers;
};

export const fetchUserTemp = async (method) => {
  const userList = await User.find({ accessLevel: "MEMBER", donationMethod: { $eq: method } }).exec();
  return userList
};

export const payUserEntrance = async (
  id,
  newCLovers,
  ticketVal,
  donationMethod
) => {
  const refillStatus = await User.findOneAndUpdate(
    { _id: id },
    {
      availableClovers: newCLovers,
      payedTicketThisSession: true,
      ticketDonationValue: ticketVal,
      donationMethod: donationMethod,
    },
    {
      new: true,
    }
  );
  return refillStatus.availableClovers;
};

export const createUserInDb = async (user) => {
  var newUser = new User(user);
  const userId = ObjectId();
  newUser.createdAt = Date.now();
  newUser.payedTicketThisSession = false;
  newUser._id = userId;
  const userSaved = await newUser.save().then(null, function (err) {
    throw new Error(err);
  });
  delete userSaved._doc.password
  return newUser;
};
