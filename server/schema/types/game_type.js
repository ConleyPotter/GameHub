const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt } = graphql;
const GameSchema = require('../../models/Game');
const Game = mongoose.model('game');
const Console = mongoose.model('console');

const GameType = new GraphQLObjectType({
  name: 'GameType',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    releaseDate: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    videoUrl: { type: GraphQLString },
    console: {
      type: require('./console_type'),
      resolve(parentValue) {
        return Console.findById(parentValue.console)
          .then(console => console)
          .catch(err => console.log(err));
      }
    },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    rating: {
      type: GraphQLInt,
      resolve(parentValue) {
        return parentValue.rating();
      }
    }
  })
});

module.exports = GameType;
