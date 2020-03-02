import nanoid from 'nanoid';
import Ticket from '../../models/Ticket';
import User from '../../models/User';

export const TicketResolver = {
  Query: {
    getATicket: async (_, args) => {
      return await Ticket.findOne({ ticketId: args.ticketId });
    },
    getUserTickets: async (_, args) => {
      return await Ticket.find({ $or: [{createdBy: args.uid}, {assignedTo: args.uid}] });
    },
    getUserAssignedTickets: async (_, args) => {
      return await Ticket.find({ assignedTo: args.uid });
    },
    getUserCreatedTickets: async (_, args) => {
      return await Ticket.find({ createdBy: args.uid });
    },
    getUserArchivedTickets: async(_, args) => {
      return await Ticket.find({
        $and: [
          { $or: [{ createdBy: args.uid }, { assignedTo: args.uid }] },
          { status: 'archived' }
        ]
      });
    }
  },
  Mutation: {
    newTicket: async (_, args) => {
      const newTicketObj = Object.assign({ ticketId: nanoid() }, args);
      return await Ticket.create(newTicketObj);
    },
    updateTicket: async (_, args) => {
      return await Ticket.findOneAndUpdate({ ticketId: args.ticketId }, { args }, { new: true });
    },
    deleteTicket: async(_, args) => {
      const mark = args.mark || true;
      if (mark) {
        return await Ticket.findOneAndUpdate({ ticketId: args.ticketId }, { status: 'deleted' });
      } else {
        return await Ticket.deleteOne({ ticketId: args.ticketId });
      }
    }
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