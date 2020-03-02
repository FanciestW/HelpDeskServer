import mongoose, { Schema } from 'mongoose';
import ITicket from '../interfaces/Ticket';
import User from './User';

const allowedStatuses = ['new', 'low', 'med', 'high', 'deleted', 'archived'];

const validateUserExists = async (uid: string) => {
  if (uid === '') {
    return true;
  } else if (await User.countDocuments({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const TicketSchema: Schema<ITicket> = new Schema<ITicket>({
  ticketId: { type: String, required: true, unique: true },
  title: {
    type: String,
    required: true,
    validate: {
      validator: (titleStr: string) => {
        return titleStr.length > 0;
      },
      message: 'A blank title is not allowed',
    },
  },
  description: { type: String, required: false, default: '' },
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
  status: {
    type: String,
    required: false,
    default: 'new',
    validate: {
      validator: (stat) => {
        if (allowedStatuses.includes(stat)) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  priority: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (priority: number) => {
        return priority >= 0 && priority <= 5;
      },
      message: 'Priority must be in the range of 0 and 5',
    }
  },
  createdAt: { type: Date, required: false, default: Date.now },
  dueDate: { type: Date, required: false, default: Date.now },
});

TicketSchema.virtual('overdue', {
  type: Boolean,
}).get(function() {
  return Date.now > this.dueDate;
});

const Ticket: mongoose.Model<ITicket> = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;
