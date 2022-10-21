import Tab from "../models/tab.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getUserCurrentTab = async (username, sessionId) => {
  const tab = await Tab.find({
    username: username,
    sessionId: sessionId,
  }).exec();
  if (tab.length === 0) return null;
  else return tab[0];
};

export const createNewTab = async (user, sessionId, createdByUsername) => {
  var newTab = new Tab();
  const tabId = ObjectId();
  newTab._id = tabId;
  newTab.createdAt = Date.now();
  (newTab.createdBy = createdByUsername), (newTab.username = user.username);
  newTab.payedTicketThisSession = false;
  newTab.userId = user._id.toString();
  newTab.sessionId = sessionId;
  newTab.availableClovers = 0;
  newTab.lastUpdatedAt = null;
  await newTab.save().then(null, function (err) {
    throw new Error(err);
  });
  return newTab;
};

export const hasTabThisSession = async (userId, sessionId) => {
  const tab = await Tab.find({
    userId,
    sessionId,
  }).exec();
  if (tab.length === 0) return false;
  else return true;
};
