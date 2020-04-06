import { Document } from 'mongoose';

interface IEmailTransaction extends Document {
  emailTransactionId: string;
  subject: string;
  sentTimestamp: Date;
  emailSentTo: string;
  triggeredBy: string;
}

export default IEmailTransaction;