// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import nanoid from 'nanoid';
import Ticket from '../../models/Ticket';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';
import { sendAssignedTicketEmail } from '../../utils/EmailSender';
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
    getTickets: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({
        $and: [
          {
            $or: [
              { createdBy: uid },
              { assignedTo: uid },
            ]
          },
          {
            $and: [
              { status: { $ne: 'deleted' }},
              { status: { $ne: 'archived' }},
            ]
          },
        ]
      });
    },
    getAssignedTickets: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({ $and: [ 
        { assignedTo: uid },
        { status: { $nin: ['archived', 'deleted'] }},
      ]});
    },
    getCreatedTickets: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({ $and: [ 
        { createdBy: uid },
        { status: { $nin: ['archived', 'deleted'] }},
      ]});
    },
    getArchivedTickets: async(_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({
        $and: [
          { $or: [{ createdBy: uid }, { assignedTo: uid }] },
          { status: 'archived' }
        ]
      });
    },
    getDeletedTickets: async(_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Ticket.find({
        $and: [
          { $or: [{ createdBy: uid }, { assignedTo: uid }] },
          { status: 'deleted' }
        ]
      });
    },
  },
  Mutation: {
    newTicket: async (_: any, args: ITicket, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const { title, description, assignedTo, status, priority, dueDate } = args;
      const newTicket = await Ticket.create({
        ticketId: nanoid(),
        title,
        description,
        createdBy: uid,
        assignedTo,
        status,
        priority,
        dueDate,
      });
      if (newTicket?.assignedTo !== newTicket?.createdBy) {
        const { firstName: assigneeName, email: assigneeEmail } = await User.findOne({ uid: newTicket?.assignedTo }, { firstName: 1, email: 1 });
        const { firstName: creatorName, email: creatorEmail } = await User.findOne({ uid: newTicket?.createdBy }, { firstName: 1, email: 1 });
        await sendAssignedTicketEmail(assigneeEmail,
          creatorEmail,
          creatorName,
          assigneeName,
          newTicket?.title,
          newTicket?.description,
          'https://github.com/FanciestW'
        );
      }
      return newTicket;
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
    dueDate: (obj: { dueDate: Date; }) => {
      const date: Date = obj.dueDate;
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