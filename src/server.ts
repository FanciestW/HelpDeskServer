import express from 'express';
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
require('dotenv').config();

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || undefined));
app.use(RequestTagger);
app.use(Logger);


app.get('/api/emailtest', async (_req, res) => {
  const resEmail = await sendAssignedTicketEmail('wlin26@yahoo.com', 'Alyson');
  res.status(200).send(JSON.stringify(resEmail, null, 2));
});

app.use('/api/graphql', AuthSession);

// Express Routes
app.use('/api/user', UserRoute);

// GraphQL
const schema = makeExecutableSchema({ typeDefs, resolvers, });
app.use('/api/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT || 3000}`);
});
