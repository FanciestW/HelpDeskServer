// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import nanoid from 'nanoid';
import Ticket from '../../models/Ticket';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';
// eslint-disable-next-line no-unused-vars
import ITicket from '../../interfaces/Ticket';

export const TicketResolver = {
  Query: {
    getATicket: async (_: any, args: { ticketId: string; }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.findOne({ $and: [
        { ticketId: args.ticketId },
        { $or: [{ createdBy: uid }, { assignedTo: uid }], }
      ]});
    },
    getUserTickets: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({ $or: [{createdBy: uid}, {assignedTo: uid}] });
    },
    getUserAssignedTickets: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({ assignedTo: uid });
    },
    getUserCreatedTickets: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({ createdBy: uid });
    },
    getUserArchivedTickets: async(_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({
        $and: [
          { $or: [{ createdBy: uid }, { assignedTo: uid }] },
          { status: 'archived' }
        ]
      });
    }
  },
  Mutation: {
    newTicket: async (_: any, args: ITicket, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const { title, description, assignedTo, status, priority, createdAt, dueDate } = args;
      return await Ticket.create({
        ticketId: nanoid(),
        title,
        description,
        createdBy: uid,
        assignedTo,
        status,
        priority,
        createdAt,
        dueDate,
      });
    },
    updateTicket: async (_: any, args: ITicket, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const { ticketId, title, description, assignedTo, status, priority, dueDate } = args;
      return await Ticket.findOneAndUpdate({ ticketId }, {
        title,
        description,
        assignedTo,
        status,
        priority,
        dueDate,
      }, { new: true });
    },
    archiveTicket: async (_: any, args: { ticketId: string; }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.findOneAndUpdate({ ticketId: args.ticketId }, { status: 'archived' }, { new: true});
    },
    deleteTicket: async(_: any, args: { mark?: boolean; ticketId: string; }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const { mark = true, ticketId } = args;
      if (mark) {
        return await Ticket.findOneAndUpdate({ ticketId }, { status: 'deleted' });
      } else {
        return await Ticket.deleteOne({ ticketId });
      }
    }
  },
  Ticket: {
    createdAt: (obj: { createdAt: Date; }) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
    dueDate: (obj: { createdAt: Date; }) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
    createdBy: async (obj: { createdBy: string; }) => {
      return await User.findOne({ uid: obj.createdBy });
    },
    assignedTo: async (obj: { assignedTo: string; }) => {
      return await User.findOne({ uid: obj.assignedTo });
    }
  }
};