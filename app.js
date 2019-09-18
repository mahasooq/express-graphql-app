const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();


app.use(bodyParser.json());


app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  }));

//
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-akd9j.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(3000, () => {
      console.log(`Server started on port ${3000}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to mongo", err);
  })

