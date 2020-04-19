import mongoose, { Schema } from 'mongoose';
import IConnectionRequest from '../interfaces/ConnectionRequest';
import User from '../models/User';

export const ConnectionRequestSchema: Schema<IConnectionRequest> = new Schema<IConnectionRequest>({
  requesterUid: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: async function (uid: string) {
        if (await User.countDocuments({ uid }) > 0) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid User',
    },
  },
  recipientUid: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: async function(uid: string) {
        if (uid !== this.requesterUid && await User.countDocuments({ uid }) > 0) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid User',
    }
  },
  status: {
    type: String,
    require: false,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected']
  }
});

ConnectionRequestSchema.index({ requesterUid: 1, recipientUid: 1 }, { unique: true });

const ConnectionRequest: mongoose.Model<IConnectionRequest> = mongoose.model<IConnectionRequest>('ConnectionRequest', ConnectionRequestSchema);
export default ConnectionRequest;
