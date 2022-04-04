import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Update = new Schema({
  updatedAt: Date,
  updatedBy: String,
  previousTicketValue: Number,
  newTicketValue: Number
});

const SessionSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  createdAt: Date,
  expiresAt: Date,
  createdBy: String,
  updates: [Update],
  currentTicketValue: Number,
  secretEntranceCode: String,
  active: Boolean
});

export default mongoose.model("Session", SessionSchema);
