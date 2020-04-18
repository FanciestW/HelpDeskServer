import { Document } from 'mongoose';

interface IConnectionRequest {
  requesterUid: string;
  recipientUid: string;
  status: string;
}

export default IConnectionRequest;