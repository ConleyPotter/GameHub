const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	games: [
		{
			type: Schema.Types.ObjectId,
			ref: 'game'
		}
	]
});

module.exports = mongoose.model('list', ListSchema);
