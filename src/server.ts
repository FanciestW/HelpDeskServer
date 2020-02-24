import express from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import RequestTagger from './middleware/RequestTagger';
import Logger from './middleware/Logger';
import { schema } from './schema/User';
require('dotenv').config();

const app = express();

app.use(RequestTagger);
app.use(Logger);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const mongoUri = process.env.MONGO_URI || 'localhost:27017/helpdesk';
mongoose.connect(mongoUri, mongooseOptions, (err) => {
  if (err) {
    console.error(`Unable to connect to MongoDB with error: ${err}`);
  } else {
    console.log('Connected to MongoDB');
  }
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT || 3000}`);
});