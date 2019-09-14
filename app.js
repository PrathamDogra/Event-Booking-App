const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

app.use(bodyParser.json());

app.use(
  "/api",
  graphqlHttp({
    schema: buildSchema(`
    type RootQuery {
        events:[String!]!
    }
    type RootMutation {
        createEvent(name: String): String
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
     `),
    // the rootValue is the resolvers in graphQL
    rootValue: {
        events: ()=>{
            return ['Robotics', 'Dance', 'Drama', 'Coding', 'Cooking'];
        },
        createEvent:(arg)=>{
            const eventName = arg.name;
            return eventName;
        }
    },
    graphiql:true
  })
);
const port = 5000 || process.env.PORT;
app.listen(port);
console.log(`Server is running on ${port}`);
