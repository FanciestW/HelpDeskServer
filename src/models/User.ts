import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@fanciestw/helpdeskmodels';

export var UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  email: { type: String, required: true },
});

export interface UserDoc extends IUser, Document {}

export const User: mongoose.Model<UserDoc> = mongoose.model<UserDoc>('User', UserSchema);