import {
  createNewOrderInDb,
  getCurrentSessionOrders,
} from "../services/order.service.js";
import Order from "../models/order.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const fetchCurrentSessionOrderStatus = async (sessionId) => {
  const orders = await getCurrentSessionOrders(sessionId);
  var total = 0;
  var count = 0;
  orders.forEach((elem) => {
    total += elem.totalClovers;
    count += 1;
  });
  return { total, count };
};

export const createNewOrder = async (
  content,
  client,
  user,
  clovers,
  sessionId
) => {
  var newOrder = new Order();
  newOrder._id = ObjectId();
  newOrder.createdAt = Date.now();
  newOrder.createdBy = user;
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
  const newOrderId = await createNewOrderInDb(newOrder);
  return newOrderId;
};
