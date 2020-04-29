// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import { getUidFromSession } from '../../utils/SessionHelper';
import Task from '../../models/Task';
// eslint-disable-next-line no-unused-vars
import ITask from '../../interfaces/Task';
import User from '../../models/User';
import { customAlphabet } from 'nanoid/async';
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 30);

export const TaskResolver = {
  Query: {
    getATask: async (_: any, args: { taskId: string }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Task.findOne({
        $and: [
          { taskId: args.taskId },
          { $or: [{ createdBy: uid }, { assignedTo: uid }] }
        ]
      });
    },
    getTasks: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Task.find({
        $and: [
          { status: { $nin: ['archived', 'deleted'] } },
          {
            $or: [
              { createdBy: uid },
              { assignedTo: uid },
            ]
          },
        ]
      });
    },
    getAssignedTasks: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Task.find({ $and: [ 
        { assignedTo: uid },
        { status: { $nin: ['archived', 'deleted'] }},
      ]});
    },
    getCreatedTasks: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Task.find({ $and: [ 
        { createdBy: uid },
        { status: { $nin: ['archived', 'deleted'] }},
      ]});
    },
    getArchivedTasks: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Task.find({ $and: [
        { $or: [{ createdBy: uid }, { assignedTo: uid }] },
        { status: 'archived' },
      ]});
    },
    getDeletedTasks: async(_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Task.find({ $and: [
        { $or: [{ createdBy: uid }, { assignedTo: uid }]},
        { status: 'deleted' },
      ]});
    },
    getUpcomingTasks: async(_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      return await Task.find({ $and: [
        { assignedTo: uid },
        { status: { $in: ['new', 'pending', 'started'] } },
        { dueDate: { $lte: oneWeekFromNow } },
      ]});
    },
  },
  Mutation: {
    newTask: async (_: any, args: ITask, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const { title, description, assignedTo, status, priority, dueDate } = args;
      return await Task.create({
        taskId: await nanoid(),
        title,
        description,
        createdBy: uid,
        assignedTo,
        status,
        priority,
        dueDate,
      });
    },
  },
  Task: {
    createdAt: (obj: { createdAt: Date }) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
    dueDate: (obj: { dueDate: Date }) => {
      const date: Date = obj.dueDate;
      return date.toISOString();
    },
    createdBy: async (obj: { createdBy: string }) => {
      return await User.findOne({ uid: obj.createdBy });
    },
    assignedTo: async (obj: { assignedTo: string }) => {
      return await User.findOne({ uid: obj.assignedTo });
    }
  }
};
