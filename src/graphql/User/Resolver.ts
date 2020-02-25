import User from '../../models/User';

// export const UserType = new GraphQLObjectType({
//   name: 'User',
//   description: 'User Object',
//   fields: () => ({
//     uid: { type: GraphQLID },
//     firstName: { type: GraphQLString },
//     middleName: { type: GraphQLString },
//     lastName: { type: GraphQLString },
//     fullName: { type: GraphQLString },
//     createdAt: { type: GraphQLString },
//     email: { type: GraphQLString },
//     passwordDigest: { type: GraphQLString },
//     phone: { type: GraphQLString },
//     company: { type: GraphQLString },
//     isTechnician: { type: GraphQLBoolean },
//   })
// });

export const UserResolvers = {
  User: {
    getAllUsers: async () => {
      return await User.find({});
    },
    getUserByUid: async (args) => {
      return await User.findOne({ uid: args.uid });
    }
  }
};
