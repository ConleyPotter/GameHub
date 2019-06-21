const graphql = require('graphql');
const mongoose = require('mongoose');
const UserType = require('./types/user_type');
const User = mongoose.model('user');
const GameType = require('./types/game_type');
const Game = mongoose.model('game');
const ConsoleType = require('./types/console_type');
const Console = mongoose.model('console');

const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = graphql;

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { username, email, password }) {
        return new User({
          username,
          email,
          password
        }).save();
      }
    },
    newGame: {
      type: GameType,
      args: {
        name: { type: GraphQLString },
        // user: { type: GraphQLID },
        description: { type: GraphQLString },
        releaseDate: { type: GraphQLString },
        console: { type: GraphQLID }
      },
      resolve(_, { name, description, releaseDate, console }) {
        return new Game({ name, description, releaseDate, console }).save();
      }
    },
    deleteGame: {
      type: GameType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return Game.deleteOne({ _id: id });
      }
    },
    newConsole: {
      type: ConsoleType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(_, { name }) {
        return new Console({ name }).save();
      }
    },
    deleteConsole: {
      type: ConsoleType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return Console.deleteOne({ _id: id });
      }
    }
  }
});

module.exports = Mutation;

