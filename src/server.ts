require('dotenv').config();
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import RequestTagger from './middleware/RequestTagger';
import UserRoute from './routes/User';
import Logger from './middleware/Logger';
import typeDefs from './graphql/Schema';
import resolvers from './graphql/AllResolver';
import { makeExecutableSchema } from 'graphql-tools';
import AuthSession from './middleware/AuthSession';
import { sendAssignedTicketEmail } from './utils/EmailSender';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/helpdeskdev';
mongoose.connect(mongoUri, mongooseOptions, (err) => {
  if (err) {
    console.error(`Unable to connect to MongoDB with error: ${err}`);
  } else {
    console.log('Connected to MongoDB');
  }
});

const app = express();

// Express Middleware
app.use('/api', bodyParser.urlencoded({ extended: true }));
app.use('/api', bodyParser.json());
app.use('/api', cookieParser(process.env.COOKIE_SECRET || undefined));
app.use('/api', RequestTagger);
app.use('/api', Logger);
app.use('/api/graphql', AuthSession);

// Express Routes
app.use('/api/user', UserRoute);

// GraphQL
const schema = makeExecutableSchema({ typeDefs, resolvers, });
app.use('/api/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// React Frontend Hosting
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', function(req, res) {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
