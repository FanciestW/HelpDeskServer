import mongoose, { Schema, Mongoose } from 'mongoose';
import ISession from '../interfaces/Session';
import User from './User';

const validateUid = async (uid) => {
  if (await User.countDocuments({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const SessionSchema: Schema = new Schema({
  sid: { type: String, required: true, unique: true },
  uid: {
    type: String,
    required: true,
    validate: {
      validator: validateUid,
      message: 'Invalid Uid',
    }
  },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true, default: Date.now() + 86400 * 1000, expires: 86400 },
});

SessionSchema.pre('save', async function(next) {
  const uid = this.get('uid');
  const userSessions = await Session.countDocuments({ uid, });
  if (userSessions >= 10) {
    throw new mongoose.Error('Too many sessions');
  }
  if (this.get('expiresAt') < this.get('createdAt')) {
    throw new mongoose.Error('expiresAt cannot be before createdAt');
  }
  next();
});

const Session: mongoose.Model<ISession> = mongoose.model('Session', SessionSchema);
export default Session;
