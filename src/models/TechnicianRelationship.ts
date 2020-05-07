import mongoose, { Schema } from 'mongoose';
import ITechnicianRelationship from '../interfaces/TechnicianRelationship';
import User from './User';

export const TechnicianRelationshipSchema: Schema<ITechnicianRelationship> = new Schema<ITechnicianRelationship>({
  technicianUid: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: async (uid: string) => {
        const foundTechnician = await User.findOne({
          $and: [
            { uid },
            { isTechnician: true },
          ]
        });
        if (foundTechnician) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid Technician UID',
    }
  },
  clientUid: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: async (uid: string) => {
        const foundClient = await User.findOne({ uid });
        if (foundClient) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid Client UID',
    }
  },
});

const TechnicianRelationship: mongoose.Model<ITechnicianRelationship> = mongoose.model<ITechnicianRelationship>('TechnicianRelationship', TechnicianRelationshipSchema);
export default TechnicianRelationship;
