import Order from './../models/order.js'

export const createNewOrderInDb = async (newOrder) => {  
    const orderSaved = await newOrder.save().then(null, function (err) { 
      throw new Error(err); 
    });
    return orderSaved._id;
  };

  export const getCurrentSessionOrders = async (sessionId) => {
    return await Order.find({sessionId: sessionId});
  }