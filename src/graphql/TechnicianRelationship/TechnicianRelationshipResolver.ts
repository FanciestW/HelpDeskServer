// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import TechnicianRelationship from '../../models/TechnicianRelationship';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';

export const TechnicianRelationshipResolver = {
  Query: {
    getTechnicians: async (_: any, _args: any, request: Request) => {
      const uid: String = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await TechnicianRelationship.find({ clientUid: uid });
    },
    getClients: async (_: any, _args: any, request: Request) => {
      const uid: String = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await TechnicianRelationship.find({ technicianUid: uid });
    }
  },
  TechnicianRelationship: {
    technician: async (obj: { technicianUid: String; }) => {
      return await User.findOne({ uid: obj.technicianUid });
    },
    client: async (obj: { clientUid: String; }) => {
      return await User.findOne({ uid: obj.clientUid });
    }
  }
};