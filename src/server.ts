import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import RequestTagger from './middleware/RequestTagger';
import SessionRoute from './routes/Session';
import Logger from './middleware/Logger';
import typeDefs from './graphql/Schema';
import resolvers from './graphql/AllResolver';
import { makeExecutableSchema } from 'graphql-tools';
require('dotenv').config();

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk';
mongoose.connect(mongoUri, mongooseOptions, (err) => {
  if (err) {
    console.error(`Unable to connect to MongoDB with error: ${err}`);
  } else {
    console.log('Connected to MongoDB');
  }
});

const app = express();

// Express Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || undefined));
app.use(RequestTagger);
app.use(Logger);

// Express Routes
app.use('/api/session', SessionRoute);


// GraphQL
const schema = makeExecutableSchema({ typeDefs, resolvers, });
app.use('/api/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT || 3000}`);
});
