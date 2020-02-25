import { mergeResolvers } from 'merge-graphql-schemas';
import { UserResolver } from './User/Resolver';
 
const resolvers = [
  UserResolver,
];
 
export default mergeResolvers(resolvers);