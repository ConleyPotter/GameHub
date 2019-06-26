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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review'
    }
  ],
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
  consoleName,
  ratingMax,
  ratingMin,
  limit
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
    console: { path: 'console' },
    reviews: { path: 'review' }
  };
  if (consoleName)
    populateFilters.console.match = { name: new RegExp(consoleName, 'i') };

  return this.find(queryFilters)
    .populate(populateFilters.console)
    .populate(populateFilters.reviews)
    .sort({ name: 1 })
    .then(games => {
      const result = games.filter(game => {
        const formattedDate = new Date(game.releaseDate);

        let ratingCheck = true;
        if (ratingMin || ratingMax) {
          ratingMin = ratingMin || 0;
          ratingMax = ratingMax || 100;
          ratingCheck =
            game.rating() >= ratingMin && game.rating() <= ratingMax;
        }

        return (
          game.console &&
          formattedDate >= dateFilters.releasedAfter &&
          formattedDate <= dateFilters.releasedBefore &&
          ratingCheck
        );
      });
      if (limit) {
        return result.slice(0, limit);
      } else return result;
    });
  // console.log(result);
  // if (limit) {
  //   return result.slice(0, limit);
  // } else return result;
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

GameSchema.statics.findReviews = function(gameId) {
  return this.findById(gameId)
    .populate('reviews')
    .then(game => game.reviews);
};

GameSchema.statics.addReview = function({ gameId, reviewId, liked }) {
  const Game = mongoose.model('game');
  const Review = mongoose.model('review');

  return Game.findById(gameId).then(game => {
    return Review.findById(reviewId).then(async review => {
      game.reviews.push(review);
      liked ? game.likes++ : game.dislikes++;
      return await game.save();
    });
  });
};

module.exports = mongoose.model('game', GameSchema);
