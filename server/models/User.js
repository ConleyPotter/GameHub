const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		min: 8,
		max: 32
	}
});

module.exports = mongoose.model('user', UserSchema);
