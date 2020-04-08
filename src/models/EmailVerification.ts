import mongoose, { Schema } from 'mongoose';
import IEmailVerification from '../interfaces/EmailVerification';
import User from './User';

const validateUid = async (uid: string) => {
  if (await User.countDocuments({ uid, }) > 0) {
    return true;
  } else {
    return false;
  }
};

export const EmailVerificationSchema: Schema<IEmailVerification> = new Schema<IEmailVerification>({
  emailVerificationId: { type: String, required: true, unqiue: true },
  verificationToken: { type: String, required: true, unique: true },
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
  expiresAt: { type: Date, required: false, default: Date.now() + 86400 * 1000, expires: 86400 },
});

const EmailVerification: mongoose.Model<IEmailVerification> = mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);