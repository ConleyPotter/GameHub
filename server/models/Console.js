const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  ]
});

ConsoleSchema.statics.findGames = function(consoleId) {
  return this.findById(consoleId)
    .populate('games')
    .then(console => console.games);
};

module.exports = mongoose.model('console', ConsoleSchema);
