const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const events=[];
app.use(bodyParser.json());

app.use(
  "/api",
  graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price:Float!
        date:String!
    }
    type RootQuery {
        events:[Event!]!
    }
    input EventInput{
        title:String!
        description: String!
        price:Float!
        date: String!
    }
    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
     `),
    // the rootValue is the resolvers in graphQL
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
          const event = {
            _id: Math.random().toString(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: args.eventInput.date
          };
          events.push(event);
          return event;
              }
    },
    graphiql: true
  })
);
const port = 5000 || process.env.PORT;
app.listen(port);
console.log(`Server is running on ${port}`);
