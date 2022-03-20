import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  createdAt: Date,
  expiresAt: Date,
  createdBy: String,
  currentEntranceFee: Number,
  secretEntranceCode: String,
  active: Boolean
});

export default mongoose.model("Session", SessionSchema);
