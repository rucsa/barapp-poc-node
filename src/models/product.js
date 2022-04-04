import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Recipe = new Schema({
  portie: Number,
  productCode: Number,
  _id: mongoose.Types.ObjectId,
});

const ProductSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  currentQty: Number,
  denumire: String,
  clovers: Number,
  color: String,
  textColor: String,
  mix: [Recipe],
  currentQty: Number,
});

export default mongoose.model("Product", ProductSchema);
