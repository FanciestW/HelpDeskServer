import express from 'express';
import graphqlHTTP from 'express-graphql';
const { buildSchema } = require('graphql');
import mongoose from 'mongoose';
require('dotenv').config();

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@helpdesk-cluster-maeej.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, mongooseOptions, (err) => {
  if (err) {
    console.error(`Unable to connect to MongoDB with error: ${err}`);
  } else {
    console.log('Connected to MongoDB');
  }
});

const app = express();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
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