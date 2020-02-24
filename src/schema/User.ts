import { GraphQLID, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import User from '../models/User';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    uid: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    passwordDigest: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  })
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: UserType,
        async resolve() {
          // await new User({
          //   uid: 'test',
          //   firstName: 'William',
          //   lastName: 'Lin',
          //   email: 'wlin26@yahoo.com',
          //   passwordDigest: '$2y$12$yj5DwGQew45E35ide2gNUugwgp2FM0PfKtGRHIApdgWShZOMFwMIi',            
          // }).save();
          return await User.findOne({ firstName: 'William', });
        }
      }
    }
  })
});
