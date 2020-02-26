import User from '../../models/User';

export const UserResolver = {
  Query: {
    getAllUsers: async () => {
      return await User.find({});
    },
    getUserByUid: async (_, args) => {
      return await User.findOne({ uid: args.uid });
    }
  },
  User: {
    createdAt: (obj) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    }
  }
};
