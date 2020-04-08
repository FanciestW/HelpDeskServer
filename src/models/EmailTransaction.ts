import mongoose, { Schema } from 'mongoose';
import IEmailTransaction from '../interfaces/EmailTransaction';

export const EmailTransactionSchema: Schema<IEmailTransaction> = new Schema<IEmailTransaction>({
  emailTransactionId: { type: String, required: true, unique: true },
  subject: { type: String, required: false },
  sentTimestamp: { type: Date, required: false, default: Date.now },
  emailSentTo: { type: String, required: true },
  triggeredBy: { type: String, required: true },
});

const EmailTransaction: mongoose.Model<IEmailTransaction> = mongoose.model<IEmailTransaction>('EmailTransaction', EmailTransactionSchema);
export default EmailTransaction;
