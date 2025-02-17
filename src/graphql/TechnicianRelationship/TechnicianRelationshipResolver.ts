// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import TechnicianRelationship from '../../models/TechnicianRelationship';
import User from '../../models/User';
import { getUidFromSession } from '../../utils/SessionHelper';

export const TechnicianRelationshipResolver = {
  Query: {
    getTechnicians: async (_: any, _args: any, request: Request) => {
      const uid: string = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const data = await TechnicianRelationship.aggregate([
        { $match: { clientUid: uid } },
        { $lookup: { from: 'users', localField: 'technicianUid', foreignField: 'uid', as: 'technician' } },
        { $unwind: { path: '$technician'} },
      ]);
      return data.map((entry) => entry?.technician);
    },
    getClients: async (_: any, _args: any, request: Request) => {
      const uid: string = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      const data = await TechnicianRelationship.aggregate([
        { $match: { technicianUid: uid } },
        { $lookup: { from: 'users', localField: 'clientUid', foreignField: 'uid', as: 'client' } },
        { $unwind: { path: '$client'} },
      ]);
      return data.map((entry) => entry?.client);
    },
    getAllTechnicianRelationships: async(_: any, _args: any, request: Request) => {
      const uid: string = await getUidFromSession(request.signedCookies?.session);
      if (!uid) return new Error('Unauthorized');
      return await TechnicianRelationship.find({
        $or: [
          { technicianUid: uid },
          { clientUid: uid },
        ]
      });
    }
  },
  TechnicianRelationship: {
    technician: async (obj: { technicianUid: string }) => {
      return await User.findOne({ uid: obj.technicianUid });
    },
    client: async (obj: { clientUid: string }) => {
      return await User.findOne({ uid: obj.clientUid });
    }
  }
};