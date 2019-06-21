const graphql = require('graphql');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const UserType = require('./user_type');
const Console = mongoose.model('console');
const ConsoleType = require('./console_type');
const Game = mongoose.model('game');
const GameType = require('./game_type');

const { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLID } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      }
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById(id);
      }
    },
    consoles: {
      type: new GraphQLList(ConsoleType),
      resolve() {
        return Console.find({});
      }
    },
    console: {
      type: ConsoleType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, { id }) {
        return Console.findById(id);
      }
    },
    games: {
      type: new GraphQLList(GameType),
      resolve() {
        return Game.find({});
      }
    },
    game: {
      type: GameType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, { id }) {
        return Game.findById(id);
      }
    }
  }
})

module.exports = RootQuery;
