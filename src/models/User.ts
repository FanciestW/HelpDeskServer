import Mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/User';

export const UserSchema: Schema<IUser> = new Schema<IUser>({
  uid: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: false, default: Date.now },
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
      message: 'PasswordDigest is invalid',
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
      },
      message: (props) => `${props.value} - is an invalid Phone Number`,
    }
  },
  company: { type: String, required: false },
  isTechnician: { type: Boolean, required: true, default: false },
});

UserSchema.virtual('fullName').get(function() {
  if(this.middleName) {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  } else {
    return `${this.firstName} ${this.lastName}`;
  }
}).set(function() {
  if(this.middleName) {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  } else {
    return `${this.firstName} ${this.lastName}`;
  }
});

const User: Mongoose.Model<IUser> = Mongoose.model<IUser>('User', UserSchema);
export default User;
