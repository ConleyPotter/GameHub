const mongoose = require('mongoose');
const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;
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
    },
    reviews: {
      type: new GraphQLList(require('./review_type')),
      resolve: async parentValue => {
        const reviews = await Game.findReviews(parentValue._id);
        return _.sortBy(reviews, 'date').reverse();
      }
    }
  })
});

module.exports = GameType;
