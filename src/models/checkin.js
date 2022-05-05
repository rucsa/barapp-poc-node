import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const CheckinSchema = new Schema({ 
  _id: mongoose.Types.ObjectId,
  createdAt: Date,
  createdBy: String,
  sessionId: String,
  username: String, 
  lastUpdatedAt: Date,
  hasTicket: Boolean,
  ticketDonationValue: Number,
  donationMethod: String,
}); 
  
export default mongoose.model('Checkin', CheckinSchema);