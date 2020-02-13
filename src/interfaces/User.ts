import { Document } from 'mongoose';

interface IUser extends Document {
    uid: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    passwordDigest: string;
    email: string;
    phone?: string;
    company?: string;
    isTechnician: boolean
}

export default IUser;
