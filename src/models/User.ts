import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/User';

export const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function validateEmail(email: string) {
        const at = email.indexOf('@');
        const dot = email.lastIndexOf('.');
        return email.length > 0 &&
          at > 0 &&
          dot > at + 1 &&
          dot < email.length &&
          email[at + 1] !== '.' &&
          email.indexOf(' ') === -1 &&
          email.indexOf('..') === -1;
      },
      message: (props) => `${props.value} - is an invalid Email`,
    },
  },
  passwordDigest: {
    type: String,
    required: true,
    validate: {
      validator: (digest: string) => {
        return digest.startsWith('$2') && digest.length >= 60;
      },
      message: 'PasswordDigest is not valid',
    }
  },
  phone: {
    type: String,
    required: false,
    validate: {
      validator: (phoneNum: string) => {
        let i = 0;
        [...phoneNum].forEach((c) => {
          if (c >= '0' && c <= '9') {
            i += 1;
          }
        });
        return i == 10 || i == 11;
      } 
    }
  },
  company: { type: String, required: false },
  isTechnician: { type: Boolean, required: true, default: false },
});

UserSchema.virtual('fullName').get(() => {
  return `${this.firstName} ${this.middleName} ${this.lastName}`;
});

export const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', UserSchema);
