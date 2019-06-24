const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
		required: true
	},
	content: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('review', ReviewSchema);
