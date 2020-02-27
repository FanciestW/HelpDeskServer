import Ticket from '../../models/Ticket';
import User from '../../models/User';

export const TicketResolver = {
  Query: {
    getUserTickets: async (_, args) => {
      return await Ticket.find({ $or: [{createdBy: args.uid}, {assignedTo: args.uid}] });
    },
    getUserAssignedTickets: async (_, args) => {
      return await Ticket.find({ assignedTo: args.uid });
    },
    getUserCreatedTickets: async (_, args) => {
      return await Ticket.find({ createdBy: args.uid });
    },
  },
  Ticket: {
    createdAt: (obj) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
    dueDate: (obj) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
    createdBy: async (obj) => {
      return await User.findOne({ uid: obj.createdBy });
    },
    assignedTo: async (obj) => {
      return await User.findOne({ uid: obj.assignedTo });
    }
  }
};