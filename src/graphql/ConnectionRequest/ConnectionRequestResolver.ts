// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import ConnectionRequest from '../../models/ConnectionRequest';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';

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
    newRequest: async (_: any, args: { recipientUid: String; }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await ConnectionRequest.create({
        requesterUid: uid,
        recipientUid: args.recipientUid
      }, { new: true, });
    },
    acceptRequest: async (_: any, args: { requesterUid: String; }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      await Connection.updateOne({
        requesterUid: args.requesterUid,
        recipientUid: uid,
      }, { status: 'accepted' });
      //TODO::Add record in TechnicianRelationships.
    },
    rejectRequest: async (_: any, args: { requesterUid: String; }, request: Request) => {
      const uid = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await Connection.updateOne({
        requesterUid: args.requesterUid,
        recipientUid: uid,
      },
      { status: 'rejected' });
    },
  },
  ConnectionRequest: {
    requester: async (obj: { requesterUid: String; }) => {
      return await User.findOne({ uid: requesterUid, });
    },
    recipient: async (obj: { recipientUid: String }) => {
      return await User.findOne({ uid: recipientUid, });
    },
  },
}