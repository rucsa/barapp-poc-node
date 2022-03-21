import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const UserSchema = new Schema({ 
  _id: mongoose.Types.ObjectId,
  username: String, 
  password: String,
  firstname: String,
  lastname: String,
  availableClovers: Number,
  guestOf: String,
  createdAt: Date,
  lastUpdatedAt: Date,
  payedTicketThisSession: Boolean
}); 
  
export default mongoose.model('User', UserSchema);