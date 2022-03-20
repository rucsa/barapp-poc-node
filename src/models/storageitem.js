import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const StorageSchema = new Schema({ 
  _id: mongoose.Types.ObjectId,
  denumire: String, 
  size: Number,
  portion: Number,
  qty: Number,
  productCode: Number
}); 
  
export default mongoose.model('StorageItem', StorageSchema);