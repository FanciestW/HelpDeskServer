import mongoose, { Schema } from 'mongoose';
import IConnectionRequest from '../interfaces/ConnectionRequest';

const validateUserExists = async (uid: string) => {
  if (uid === '') {
    return true;
  } else if (await User.countDocuments({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const ConnectionRequest: Schema<IConnectionRequest> = new Schema<IConnectionRequest>({
  requesterUid: {
    type: String,
    required: true,
    validate: {
      validator: async (uid: string) => {
        if (await User.countDocuments({ uid }) > 0) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Invalid User',
    },
  },
  receipientUid: {
    type: String,
    required: true,
    validate: {
      validator: async (uid: string) => {
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

const ConnectionRequest: mongoose.Model<IConnectionRequest> = mongoose.model<IConnectionRequest>('ConnectionRequest', ConnectionRequest);
export default ConnectionRequest;
