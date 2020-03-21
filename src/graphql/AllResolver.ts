import { mergeResolvers } from 'merge-graphql-schemas';
import { UserResolver } from './User/UserResolver';
import { TicketResolver } from './Ticket/TicketResolver';
import { TaskResolver } from './Task/TaskResolver';
 
const resolvers = [
  UserResolver,
  TicketResolver,
  TaskResolver,
];
 
export default mergeResolvers(resolvers);