import { Request, Response } from 'express';
import nanoid from 'nanoid';
import Ticket from '../../models/Ticket';
import User from '../../models/User';
import { getUserFromSession } from '../../utils/SessionHelper';

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
    newTicket: async (_, args, request: Request) => {
      const user = await getUserFromSession(request.signedCookies?.session);
      if (!user) return new Error('Unauthorized');
      const { title, description, assignedTo, status, priority, createdAt, dueDate } = args;
      return await Ticket.create({
        ticketId: nanoid(),
        title,
        description,
        createdBy: user?.uid,
        assignedTo,
        status,
        priority,
        createdAt,
        dueDate,
      });
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