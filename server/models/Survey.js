const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SurveySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  console: {
    type: Schema.Types.ObjectId,
    ref: "console"
  },
  favoriteGameOf2019: {
    type: Schema.Types.ObjectId,
    ref: "game"
  },
  favoriteGameOf2018: {
    type: Schema.Types.ObjectId,
    ref: "game"
  },
  mostAnticipatedGame: {
    type: Schema.Types.ObjectId,
    ref: "game"
  }
});

module.exports = mongoose.model("survey", SurveySchema);