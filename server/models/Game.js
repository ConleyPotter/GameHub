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
	}
});

GameSchema.statics.findByFilters = function({ name, description, releasedAfter, releasedBefore, consoleName }) {
	const queryFilters = {};
	if (name) queryFilters.name = new RegExp(name, 'i');
	if (description) queryFilters.description = new RegExp(description, 'i');

	const dateFilters = {};
	dateFilters.releasedAfter = releasedAfter ? new Date(releasedAfter) : new Date('01/01/1950');
	dateFilters.releasedBefore = releasedBefore ? new Date(releasedBefore) : new Date('12/31/2100');

	const populateFilters = {
		console: { path: 'console' }
	};
	if (consoleName) populateFilters.console.match = { name: new RegExp(consoleName, 'i') };

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

module.exports = mongoose.model('game', GameSchema);
