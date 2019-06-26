const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql;

const User = mongoose.model('user');
const Game = mongoose.model('game');
const Console = mongoose.model('console');

const SurveyType = new GraphQLObjectType({
  name: "SurveyType",
  fields: () => ({
    _id: { type: GraphQLID },
    console: {
      type: require("./console_type"),
      resolve(parentValue) {
        return Console.findById(parentValue.console)
          .then(console => console)
          .catch(err => console.log(err));
      }
    },
    user: {
      type: require('./user_type'),
      resolve(parentValue) {
        return User.findById(parentValue.user)
          .then(user => user)
          .catch(err => console.log(err));
      }
    },
    favoriteGameOf2019: {
      type: require('./game_type'),
      resolve(parentValue) {
        return Game.findByFilters(parentValue.favoriteGameOf2019Id)
          .then(game => game)
          .catch(err => err)
      }
    },
    favoriteGameof2018: {
      type: require('./game_type'),
      resolve(parentValue) {
        return Game.findById(parentValue.favoriteGameOf2018Id)
          .then(game => game)
          .catch(err => err)
      }
    },
    mostAnticipatedGame: {
      type: require('./game_type'),
      resolve(parentValue) {
        return Game.findById(parentValue.mostAnticipatedGameId)
          .then(game => game)
          .catch(err => err)
      }
    }
  })
});

module.exports = SurveyType;
