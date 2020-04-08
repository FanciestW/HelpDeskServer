import { Document } from 'mongoose';

interface IEmailVerification extends Document {
  emailVerficationId: string;
  verificationToken: string;
  uid: string;
  expiresAt: Date;
  createdAt: Date;
}

export default IEmailVerification;