import express from 'express';
import graphqlHTTP from 'express-graphql';
const { buildSchema } = require('graphql');
import mongoose from 'mongoose';
import RequestTagger from './middleware/RequestTagger';
import Logger from './middleware/Logger';
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

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello World';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT || 3000}`);
});