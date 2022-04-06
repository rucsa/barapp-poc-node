import {
  createNewOrderInDb,
  getCurrentSessionOrders, getAnonymousOrdersFromDB, getMemberOrdersFromDB
} from "../services/order.service.js";
import Order from "../models/order.js";
import log from './../utils/logger.js'

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const fetchCurrentSessionOrderStatus = async (sessionId) => {
  const orders = await getCurrentSessionOrders(sessionId);
  var total = 0;
  var count = 0;
  var anonymous = 0;
  orders.forEach((elem) => {
    total += elem.totalClovers;
    count += 1;
    if (elem.beneficiaryName.localeCompare("Anonymous") === 0) {
      anonymous += 1
    }
  });
  return { total, count, anonymous };
};

export const createNewOrder = async (
  content,
  client,
  username,
  clovers,
  sessionId
) => {
  var newOrder = new Order();
  newOrder._id = ObjectId();
  newOrder.createdAt = Date.now();
  newOrder.createdBy = username;
  newOrder.beneficiaryName = client;
  newOrder.totalClovers = clovers;
  newOrder.sessionId = sessionId;
  const orderContents = [];

  content.forEach((element) => {
    const item = {
      name: element.denumire,
      qty: element.count,
      _id: element._id,
    };
    orderContents.push(item);
  });
  newOrder.content = orderContents;
  log(
    username,
    `Creating new order for ${client} of ${clovers} clovers`,
    "info"
  );
  const newOrderId = await createNewOrderInDb(newOrder);
  return newOrderId;
};

export const getAnonymousOrders = async () => {
  let clovs = 0
  const orders = await getAnonymousOrdersFromDB();
  orders.forEach((o)=>{
    clovs += o.totalClovers
  })
  return clovs;
};

export const getMemberOrders = async () => {
  let clovs = 0
  const orders = await getMemberOrdersFromDB()
  orders.forEach((o)=>{
    clovs += o.totalClovers
  })
  return clovs;
};