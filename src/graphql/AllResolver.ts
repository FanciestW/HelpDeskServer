import { mergeResolvers } from 'merge-graphql-schemas';
import { UserResolver } from './User/UserResolver';
import { TicketResolver } from './Ticket/TicketResolver';
import { TaskResolver } from './Task/TaskResolver';
import { ConnectionRequestResolver } from './ConnectionRequest/ConnectionRequestResolver';
import { TechnicianRelationshipResolver } from './TechnicianRelationship/TechnicianRelationshipResolver';
 
const resolvers = [
  UserResolver,
  TicketResolver,
  TaskResolver,
  ConnectionRequestResolver,
  TechnicianRelationshipResolver,
];
 
export default mergeResolvers(resolvers);