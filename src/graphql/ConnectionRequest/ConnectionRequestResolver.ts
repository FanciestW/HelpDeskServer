// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import ConnectionRequest from '../../models/ConnectionRequest';
import TechnicianRelationship from '../../models/TechnicianRelationship';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';
import IUser from '../../interfaces/User';
import { customAlphabet } from 'nanoid/async';
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 30);

export const ConnectionRequestResolver = {
  Query: {
    getReceivedRequests: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await ConnectionRequest.find({
        $and: [
          { recipientUid: uid },
          { status: 'pending' },
        ]
      });
    },
    getSentRequests: async (_: any, _args: any, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await ConnectionRequest.find({ requesterUid: uid });
    },
  },
  Mutation: {
    newRequest: async (_: any, args: { recipientUid: string }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await ConnectionRequest.create({
        requestId: await nanoid(),
        requesterUid: uid,
        recipientUid: args.recipientUid
      });
    },
    newEmailRequest: async (_: any, args: { recipientEmail: string }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const recipientUser: IUser = await User.findOne({ email: args.recipientEmail });
      if (!recipientUser) {
        return new Error('No user with email exists');
      } else {
        return await ConnectionRequest.create({
          requestId: await nanoid(),
          requesterUid: uid,
          recipientUid: recipientUser?.uid,
        });
      }
    },
    acceptRequest: async (_: any, args: { requesterUid: string }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const connectionRequest = await ConnectionRequest.findOneAndUpdate({
        requesterUid: args.requesterUid,
        recipientUid: uid,
      }, { status: 'accepted' }, { new: true });
      console.log(JSON.stringify(connectionRequest, null, 2));
      await TechnicianRelationship.create({
        clientUid: connectionRequest.requesterUid,
        technicianUid: connectionRequest.recipientUid,
      });
      return connectionRequest;
    },
    rejectRequest: async (_: any, args: { requesterUid: string }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await ConnectionRequest.updateOne({
        requesterUid: args.requesterUid,
        recipientUid: uid,
      },
      { status: 'rejected' });
    },
  },
  ConnectionRequest: {
    requester: async (obj: { requesterUid: string }) => {
      return await User.findOne({ uid: obj.requesterUid, });
    },
    recipient: async (obj: { recipientUid: string }) => {
      return await User.findOne({ uid: obj.recipientUid, });
    },
  },
};