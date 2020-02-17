import mongoose, { Schema } from 'mongoose';
import ITicket from '../interfaces/Ticket';
import User from './User';

const validateUserExists = async (uid) => {
  if (uid === '') {
    return true;
  } else if (await User.countDocuments({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const TicketSchema: Schema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  title: { type: String, required: true, default: '' },
  description: { type: String, required: true, default: '' },
  createdBy: { 
    type: String,
    required: true,
    validate: validateUserExists,
    message: 'Invalid User',
  },
  assignedTo: {
    type: String,
    required: false,
    validate: validateUserExists,
    message: 'Invalid User',
  },
});

const Ticket: mongoose.Model<ITicket> = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;
