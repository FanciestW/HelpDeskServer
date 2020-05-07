import { Document } from 'mongoose';

interface IConnectionRequest extends Document {
  requestId: string;
  requesterUid: string;
  recipientUid: string;
  status: string;
}

export default IConnectionRequest;