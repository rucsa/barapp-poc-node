import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Item = new Schema({
    name: String,
    qty: Number,
    _id: mongoose.Types.ObjectId,
  });

const OrderSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  createdAt: Date,
  createdBy: String,
  beneficiaryName: String,
  totalClovers: Number,
  content: [Item],
  sessionId: mongoose.Types.ObjectId,
});

export default mongoose.model("Order", OrderSchema);
