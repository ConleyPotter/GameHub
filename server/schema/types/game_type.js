const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const Console = mongoose.model('console');

const GameType = new GraphQLObjectType({
  name: "GameType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    releaseDate: { type: GraphQLString },
    console: { 
      type: require('./console_type'),
      resolve(parentValue) {
        return Console.findById(parentValue.console)
          .then(console => console)
          .catch(err => console.log(err))
      }
    }
  })
})

module.exports = GameType;
