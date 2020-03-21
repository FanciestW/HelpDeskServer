
// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
// eslint-disable-next-line no-unused-vars
import IUser from '../../interfaces/User';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';

export const UserResolver = {
  Query: {
    getUserInfo: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await User.findOne({ uid });
    },
  },
  Mutation: {
    updateUser: async (_: any, args: IUser, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return User.findOneAndUpdate({ uid: args.uid }, args, { new: true });
    },
  },
  User: {
    createdAt: (obj) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
  }
};
