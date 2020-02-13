import { Document } from 'mongoose';

interface ISession extends Document {
    sid: string;
    uid: string;
    createdAt: Date;
    expiresAt: Date;
}

export default ISession;
