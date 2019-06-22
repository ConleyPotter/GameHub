const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	console: {
		type: Schema.Types.ObjectId,
		ref: 'consoles'
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
	}
});

module.exports = mongoose.model('game', GameSchema);
