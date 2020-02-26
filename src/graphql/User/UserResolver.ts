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
  Mutation: {
    newUser: async (_, args) => {
      return await User.create(args);
    },
    updateUser: async (_, args) => {
      return User.findOneAndUpdate({ uid: args.uid }, args, { new: true, upsert: true, });
    },
    deleteUser: async (_, args) => {
      return await User.deleteOne({ uid: args.uid });
    },
  },
  User: {
    createdAt: (obj) => {
      const date: Date = obj.createdAt;
      return date.toISOString();
    },
  }
};
