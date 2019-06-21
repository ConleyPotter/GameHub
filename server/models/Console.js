const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: 'games'
    }
  ]
});

ConsoleSchema.statics.findGames = function(consoleId) {
  return this.findById(consoleId)
    .populate("game")
    .then(console => console.games);
};


module.exports = mongoose.model("console", ConsoleSchema);