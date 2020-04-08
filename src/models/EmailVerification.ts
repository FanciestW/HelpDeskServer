import mongoose, { Schema } from 'mongoose';
import IEmailVerification from '../interfaces/EmailVerification';
import User from './User';
import Session from './Session';

const validateUid = async (uid: string) => {
  if (await User.countDocuments({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const EmailVerificationSchema: Schema<IEmailVerification> = new Schema<IEmailVerification>({
  emailVerificationId: { type: String, required: true, unqiue: true },
  uid: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateUid,
      message: 'Invalid Uid',
    }
  },
  createdAt: { type: Date, required: false, default: Date.now },
  expiresAt: { type: Date, required: false, default: Date.now() + 3600 * 1000, expires: 3600 },
});

const EmailVerification: mongoose.Model<IEmailVerification> = mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);
export default EmailVerification;
