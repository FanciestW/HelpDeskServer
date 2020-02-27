import express, { Request, Response } from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import RequestTagger from './middleware/RequestTagger';
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

app.use(RequestTagger);
app.use(Logger);

const schema = makeExecutableSchema({ typeDefs, resolvers, });
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT || 3000}`);
});