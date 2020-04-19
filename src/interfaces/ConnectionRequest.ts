import { Document } from 'mongoose';

interface IConnectionRequest extends Document {
  requesterUid: string;
  recipientUid: string;
  status: string;
}

export default IConnectionRequest;