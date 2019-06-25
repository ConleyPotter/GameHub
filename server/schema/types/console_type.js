const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const Console = mongoose.model('console');
const Game = mongoose.model('game');

const ConsoleType = new GraphQLObjectType({
  name: 'ConsoleType',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    games: {
      type: new GraphQLList(require('./game_type')),
      resolve(parentValue) {
        return Console.findGames(parentValue._id);
      }
    },
    topGames: {
      type: new GraphQLList(require('./game_type')),
      resolve(parentValue) {
        return Console.findTopGames(parentValue._id);
      }
    },
    upcomingGames: {
      type: new GraphQLList(require('./game_type')),
      resolve(parentValue) {
        const today = new Date().toString();
        return Game.findByFilters({
          releasedAfter: today,
          consoleName: parentValue.name
        }).then(games => {
          let gameList = games.slice(0, 10);
          return gameList.sort((a, b) => {
            return new Date(a.releaseDate) - new Date(b.releaseDate);
          });
        });
      }
    }
  })
});

module.exports = ConsoleType;
