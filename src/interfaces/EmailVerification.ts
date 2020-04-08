import { Document } from 'mongoose';

interface IEmailVerification extends Document {
  emailVerificationId: string;
  verificationToken: string;
  uid: string;
  expiresAt: Date;
  createdAt: Date;
}

export default IEmailVerification;