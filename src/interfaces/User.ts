import { Document } from 'mongoose';

interface IUser extends Document {
    uid: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    fullName?: string;
    passwordDigest: string;
    email: string;
    verified: boolean;
    phone?: string;
    company?: string;
    isTechnician: boolean;
    createdAt: Date;
}

export default IUser;
