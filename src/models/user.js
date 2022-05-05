import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const UserSchema = new Schema({ 
  _id: mongoose.Types.ObjectId,
  username: String, 
  password: String,
  firstname: String,
  lastname: String,
  phone: String,
  email: String,
  availableClovers: Number,
  guestOf: String,
  createdAt: Date,
  createdBy: String,
  lastUpdatedAt: Date,
  accessLevel: String,
  revoId: String,
  changePassRequestCode: String,
}); 
  
export default mongoose.model('User', UserSchema);