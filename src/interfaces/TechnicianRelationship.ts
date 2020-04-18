import { Document } from 'mongoose';

interface ITechnicianRelationship extends Document {
  technicianUid: string;
  clientUid: string;
}

export default ITechnicianRelationship;