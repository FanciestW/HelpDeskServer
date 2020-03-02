import { mergeResolvers } from 'merge-graphql-schemas';
import { UserResolver } from './User/UserResolver';
import { TicketResolver } from './Ticket/TicketResolver';
 
const resolvers = [
  UserResolver,
  TicketResolver,
];
 
export default mergeResolvers(resolvers);