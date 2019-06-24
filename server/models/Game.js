const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  console: {
    type: Schema.Types.ObjectId,
    ref: 'console'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: false
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
});

GameSchema.statics.findByFilters = function({
  name,
  description,
  releasedAfter,
  releasedBefore,
  consoleName
}) {
  const queryFilters = {};
  if (name) queryFilters.name = new RegExp(name, 'i');
  if (description) queryFilters.description = new RegExp(description, 'i');

  const dateFilters = {};
  dateFilters.releasedAfter = releasedAfter
    ? new Date(releasedAfter)
    : new Date('01/01/1950');
  dateFilters.releasedBefore = releasedBefore
    ? new Date(releasedBefore)
    : new Date('12/31/2100');

  const populateFilters = {
    console: { path: 'console' }
  };
  if (consoleName)
    populateFilters.console.match = { name: new RegExp(consoleName, 'i') };

  return this.find(queryFilters)
    .populate(populateFilters.console)
    .sort({ name: 1 })
    .then(games =>
      games.filter(game => {
        const formattedDate = new Date(game.releaseDate);
        return (
          game.console &&
          formattedDate >= dateFilters.releasedAfter &&
          formattedDate <= dateFilters.releasedBefore
        );
      })
    );
};

// GameSchema.statics.rating = function(gameId) {
//   return this.findById(gameId).then(game => {
//     let totalVotes = game.likes + game.dislikes;
//     return Math.floor((game.likes / totalVotes) * 100);
//   });
// };
GameSchema.methods.rating = function() {
  let totalVotes = this.likes + this.dislikes;
  return Math.floor((this.likes / totalVotes) * 100);
};

module.exports = mongoose.model('game', GameSchema);
