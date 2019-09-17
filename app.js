const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require("./models/event");
const User = require("./models/user");


const app = express();

const events = eventIds => {
  console.log(eventIds);
  return Event.find({ _id : { $in : eventIds } })
    .then(events => {
      console.log("Here in events : ", events);
      return events.map((event) => {
        return { ...event._doc, _id: event.id, createdBy: user.bind(this, event._doc.createdBy)};
      }); 
    })
    .catch(err => {
      throw err;
    })
};

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return { ...user._doc, _id:user.id, createdEvents : events.bind(this, user._doc.createdEvents) };
    })
    .catch(err => {
      throw err;
    })
}

app.use(bodyParser.json());


app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                createdBy: User!
            }

            type User {
              _id: ID!
              email: String!
              password: String
              createdEvents:[Event!]
            }

            input EventInput {
                title: String!
                description: String! 
            }

            input UserInput {
              email: String!
              password: String! 
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            console.log("Events : ", events);
            return events.map((event) => {
              return { ...event._doc, _id: event.id, createdBy: user.bind(this, event._doc.createdBy)};
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createEvent: (args) => {
        let event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          createdBy: "5d7cd1057a8d41491ccda6c7"
        })
        let createdEvent;
        return event
          .save()
          .then((result) => {            
            createdEvent = { ...result._doc, _id: result.id, createdBy: user.bind(this, result._doc.createdBy)};
            return User.findById("5d7cd1057a8d41491ccda6c7");         
          })
          .then(user => {
            console.log(user);
            if(!user) {
              throw new Error("User not found");
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          })
      },
      createUser: args => {
        return User
        .findOne({email:args.userInput.email})
        .then(user => {
          if(user) {
            throw new Error('user already existing');
          }
          return bcrypt.hash(args.userInput.password, 12);
        })       
        .then(hashedPassword => {
          let user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user.save();
        })
        .then(user => {
          console.log(user);
          return {...user._doc, password:null, _id:user.id};
        })
        .catch(err=>{
          throw err;
        })
      }
    },
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

