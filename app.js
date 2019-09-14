const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
const Event = require("./models/event");

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
          return Event.find().then(events=>{
              return events.map(event =>{
                  return { ...event._doc, _id: event._doc._id.toString() };
              });

          });
              },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event.save()
          .then(result => {
            return { ...result._doc, _id:result._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@node-cluster-gx6ut.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`The connection to MongoDB is established`))
  .catch(err => console.log(err));

const port = 5000 || process.env.PORT;
app.listen(port);
console.log(`Server is running on ${port}`);
