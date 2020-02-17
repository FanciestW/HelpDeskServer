import mongoose, { Schema } from 'mongoose';
import ISession from '../interfaces/Session';
import User from './User';

const validateUid = async (uid) => {
  if (uid === '') {
    return true;
  } else if (await User.count({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const SessionSchema: Schema = new Schema({
  sid: { type: String, required: true },
  uid: {
    type: String,
    required: true,
    validate: {
      validator: validateUid,
      message: 'Invalid Uid',
    }
  },
  createdAt: { type: Date, required: false, default: Date.now },
  expiresAt: { type: Date, required: false, default: Date.now() + 64000 },
});

const Session: mongoose.Model<ISession> = mongoose.model('Session', SessionSchema);
export default Session;
