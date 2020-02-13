import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/User';

export const UserSchema: Schema = new Schema({
  firstName: { type: Number, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function validateEmail(email) {
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
      validator: function validateHash(digest) {
        return digest.startsWith('$2') && digest.length >= 60;
      },
      message: 'PasswordDigest is not valid',
    }
  },
});

// UserSchema.virtual('fullName',)

export const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', UserSchema);
