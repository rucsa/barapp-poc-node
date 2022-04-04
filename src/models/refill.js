import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RefillSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  createdAt: Date,
  createdBy: String,
  beneficiaryName: String,
  refillWith: Number,
  totalClovers: Number,
  donationMethod: String,
  sessionId: mongoose.Types.ObjectId,
});

export default mongoose.model("Refill", RefillSchema);