const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameSchema = require('./Game');
const Game = mongoose.model('game');

const ConsoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: 'game'
    }
  ],
  imageURL: {
    type: String,
    required: true
  }
});

ConsoleSchema.statics.findGames = function(consoleId) {
  return this.findById(consoleId)
    .populate('games')
    .then(console => console.games);
};

ConsoleSchema.statics.findTopGames = function(consoleId) {
  return this.findById(consoleId)
    .populate('games')
    .then(consoles => {
      return consoles.games
        .sort((a, b) => {
          return b.rating() - a.rating();
        })
        .slice(0, 10)
        .filter(game => game.rating());
    });
};

module.exports = mongoose.model('console', ConsoleSchema);
