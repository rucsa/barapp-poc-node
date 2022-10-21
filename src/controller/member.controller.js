import log from "./../utils/logger.js";
import { getUserByIdFromDb } from "./../services/user.service.js";
import { getUserCurrentTab, createNewTab, hasTabThisSession } from "./../services/tab.service.js";
import { getActiveSession } from "./../controller/session.controller.js";
import qrcode from "qrcode";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

async function constructMemberObject(userId) {
  const session = await getActiveSession();
  const user = await getUserByIdFromDb(userId);

  if (user === null) {
    // error
  }

  // create member data object for response
  const userStatus = {};
  userStatus.userId = user._id;
  userStatus.firstname = user.firstname;
  userStatus.lastname = user.lastname;
  userStatus.username = user.username;

  if (session != null) {
    userStatus.activeSession = true;

    const hasCheckedIn = await hasTabThisSession(user._id, session._id);
    let tab
    if (!hasCheckedIn) {
      tab = await createNewTab(user, session._id);
    } else {
     tab = await getUserCurrentTab(user.username, session._id);
    }
   

    userStatus.availableClovers = tab.availableClovers;
    userStatus.checkedIn = hasCheckedIn;
    userStatus.hasTicket = hasCheckedIn === true ? tab.donationMethod != null && tab.donationMethod != '' : false
  } else {
    userStatus.activeSession = false;
  }
  return userStatus;
}

async function generateQR(text) {
  return qrcode.toDataURL(text);
}

export const fetchMemberData = async (userId) => {
  return await constructMemberObject(userId);
};

export const fetchMemberQR = async (userId) => {
  const userStatus = await fetchMemberData(userId);
  try {
    console.log(userStatus);
    return generateQR(JSON.stringify(userStatus));
  } catch (ex) {
    console.log(ex);
    // throw new DetailedError({
    //   code: 'auth.activate-two-fa.qr-generation-error',
    //   message: 'error while generating qr code',
    //   causedBy: ex,
    //   emitter: EMITTER_ID,
    // });
  }
};

export const hasCheckedIn = async (sessionId, userId) => {
  return await hasTabThisSession(userId, sessionId)
}

export const checkMemberIn = async (username, sessionId, userId) => {
    return  await createNewTab(userId, sessionId, username);
}

