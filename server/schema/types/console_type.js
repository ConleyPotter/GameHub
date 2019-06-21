const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const Console = mongoose.model('console');

const ConsoleType = new GraphQLObjectType({
  name: "ConsoleType",
  fields: () =>  ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    games: {
      type: new GraphQLList(require('./game_type')),
      resolve(parentValue) {
        return Console.findGames(parentValue._id);
      }
    }
  })
});

module.exports = ConsoleType;