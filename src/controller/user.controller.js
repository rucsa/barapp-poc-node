import bcrypt from "bcryptjs";
import PrettyError from "../utils/errors.js";

import {
  getUserByIdFromDb,
  updateUserBalance,
  payUserEntrance,
  addPassChangeCodeToUser,
  changePassForUser,
  isUsernameUnique,
  isEmailUnique,
  isPhoneUnique,
  fetchUserTemp, fetchUsersByAccessFromDB
} from "../services/user.service.js";
import {
  createUserInDb,
  getAllUsersFromDB,
  getMembers,
  getUserByEmail,
} from "../services/user.service.js";
import { createNewOrder } from "./order.controller.js";
import { substractOrderFromStorage } from "./storage.controller.js";
import { getActiveSessionTicketValue } from "../services/session.service.js";
import { createNewRefill } from "./refill.controller.js";

import log from "./../utils/logger.js";

const EMITTER_ID = "src/controller/user.controller.js";

export const fetchCurrentSessionTicketStatus = async () => {
  const memberList = await getMembers();
  var total = 0;
  var count = 0;
  memberList.forEach((tripper) => {
    if (tripper.payedTicketThisSession === true) {
      count += 1;
      total += tripper.ticketDonationValue;
    }
  });
  return { total, count };
};

export const getUserById = async (id) => {
  const user = await getUserByIdFromDb(id);
  delete user._doc.password;
  return user;
};

export const fetchAllUsersByAccess = async (access) => {
  const userList = await fetchUsersByAccessFromDB(access)
  return userList.length
}

export const fetchAllUsers = async (username) => {
  const userList = await getAllUsersFromDB();
  const cleanList = [];
  userList.forEach((user) => {
    delete user._doc.password;
    cleanList.push(user);
  });
  log(username, `Fetching all users`, "info");
  return userList;
};

export const userTicketPayment = async (
  id,
  ticket,
  donationMethod,
  username
) => {
  let ticketValue;
  if (ticket == null) {
    ticketValue = await getActiveSessionTicketValue();
  } else {
    ticketValue = ticket;
  }
  const user = await getUserByIdFromDb(id);
  const newAvailableClovers = Number(user.availableClovers) - ticketValue;
  log(
    username,
    `Exchanged ticket for ${donationMethod} (clovers) from member ${user.username}`
  );
  const updatedClovers = await payUserEntrance(
    id,
    newAvailableClovers,
    ticketValue,
    donationMethod
  );
  return updatedClovers;
};

export const refillUser = async (
  createdBy,
  id,
  newClovers,
  method,
  sessionId
) => {
  try {
    const user = await getUserByIdFromDb(id);
    const newAvailableClovers =
      Number(user.availableClovers) + Number(newClovers);
    const updatedClovers = await updateUserBalance(id, newAvailableClovers);
    const refill = await createNewRefill(
      createdBy,
      user.username,
      Number(newClovers),
      newAvailableClovers,
      method,
      sessionId
    );
    log(
      createdBy,
      `Created new refill of ${newClovers} clovers for ${user.username} by ${method}`
    );
    return updatedClovers;
  } catch (error) {
    console.log(error);
  }
};

export const registerNewOrder = async (
  id,
  total,
  content,
  sessionId,
  username
) => {
  let updatedClovers = total;
  let newOrderId = null;
  if (id === "undefined") {
    newOrderId = await createNewOrder(
      content,
      "Anonymous",
      username,
      Number(total),
      sessionId
    );
  } else {
    // Update user balance
    const client = await getUserByIdFromDb(id);
    const newAvailableClovers = Number(client.availableClovers) - Number(total);
    updatedClovers = await updateUserBalance(id, newAvailableClovers);

    // add new order in collection
    newOrderId = await createNewOrder(
      content,
      client.username,
      username,
      Number(total),
      sessionId
    );
  }

  // substract portions from storage
  try {
    await substractOrderFromStorage(content, username);
  } catch (err) {
    console.log(err);
  }
};

export const registerUser = async (newUserData) => {
  // validate unique username
  const usernameCheck = await isUsernameUnique(newUserData.username);
  if (usernameCheck !== true) {
    throw new PrettyError({
      code: "username-taken",
      message: "This username is taken!",
      inFile: EMITTER_ID,
    });
  }
  // validate unique email
  const emailCheck = await isEmailUnique(newUserData.email);
  if (emailCheck !== true) {
    throw new PrettyError({
      code: "email-taken",
      message: "This email is taken!",
      inFile: EMITTER_ID,
    });
  }
  // validate unique phone
  const phoneCheck = await isPhoneUnique(newUserData.phone);
  if (phoneCheck !== true) {
    throw new PrettyError({
      code: "phone-taken",
      message: "This phone number is taken!",
      inFile: EMITTER_ID,
    });
  }
  const user = await createUserInDb(newUserData);
  delete user._doc.password;
  return user;
};

export const requestPassChange = async (userEmail) => {
  if (userEmail == null) {
    throw new PrettyError({
      code: "invalid_email",
      message: `invalid email`,
      inFile: EMITTER_ID,
    });
  }
  const user = await getUserByEmail(userEmail);
  if (user == null) {
    throw new PrettyError({
      code: "invalid-user",
      message: "User not found!",
      inFile: EMITTER_ID,
    });
  }
  const code = Math.floor(Math.random() * 100000);
  await addPassChangeCodeToUser(user._id, code);
  return code;
};

export const processPassChange = async (id, code, newPass) => {
  const user = await getUserByIdFromDb(id);
  if (user == null) {
    throw new PrettyError({
      code: "invalid-user",
      message: "User not found!",
      inFile: EMITTER_ID,
    });
  }
  if (user.changePassRequestCode !== code) {
    throw new PrettyError({
      code: "invalid-code",
      message: "Code does not match!",
      inFile: EMITTER_ID,
    });
  }
  const cryptePass = await bcrypt.hash(newPass, 10);
  return await changePassForUser(id, cryptePass);
};

export const getColdUsersClovs = async (method) => {
  const users = await fetchUserTemp(method);
  var clovs = 0;
  users.forEach((u) => {
    if (u.ticketDonationValue != null) {
      clovs += u.ticketDonationValue;
    }
  });
  return clovs
};
