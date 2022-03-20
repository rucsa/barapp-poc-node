import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const ProductSchema = new Schema({ 
  _id: mongoose.Types.ObjectId,
  denumire: String, 
  clovers: Number,
  color: String
}); 
  
export default mongoose.model('Product', ProductSchema);