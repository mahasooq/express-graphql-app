const { buildSchema } = require('graphql');


module.exports = buildSchema(`

  type Booking {
    _id: ID!
    user: User!
    event: Event!
    createdAt: String!
  }

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
  
  type AuthData {
    userID : ID!
    token : String!
    tokenExpiration : Int!
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
      bookings: [Booking!]!
      login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
      bookEvent(eventID: ID!):Booking!
      cancelBooking(bookingID: ID!):Event!
  }

  schema {
      query: RootQuery
      mutation: RootMutation
  }
`);