const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const ReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	game: {
		type: Schema.Types.ObjectId,
		ref: 'game'
	},
	title: {
		type: String,
		default: 'Untitled Review',
		required: false
	},
	content: {
		type: String,
		required: false
	},
	date: {
		type: Date,
		default: Date.now
	},
	liked: {
		type: Boolean,
		required: true
	}
});

ReviewSchema.statics.findRecentLikes = function() {
	let checkDate = new Date();
	checkDate.setDate(checkDate.getDate() - 7);
	const Game = mongoose.model('game');
	return this.find({ date: { $gt: checkDate }, liked: true });
};

module.exports = mongoose.model('review', ReviewSchema);
