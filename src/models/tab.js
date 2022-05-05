import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TabSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  username: String,
  userId: String,
  sessionId: String,
  availableClovers: Number,
  createdAt: Date,
  createdBy: String,
  lastUpdatedAt: Date,
});

export default mongoose.model("Tab", TabSchema);
