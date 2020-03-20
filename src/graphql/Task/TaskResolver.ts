// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import nanoid from 'nanoid';
import { getUidFromSession } from '../../utils/SessionHelper';
import Task from '../../models/Task';
// eslint-disable-next-line no-unused-vars
import ITask from '../../interfaces/Task';
import User from '../../models/User';


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
          {
            $and: [
              { status: { $ne: 'deleted' }},
              { status: { $ne: 'archived' }},
            ]
          },
          {
            $or: [
              { createdBy: uid },
              { assignedTo: uid },
            ]
          },
        ]
      });
    },
  },
  Mutation: {
    newTask: async (_: any, args: ITask, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const { title, description, assignedTo, status, priority, dueDate } = args;
      return await Task.create({
        taskId: nanoid(),
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
