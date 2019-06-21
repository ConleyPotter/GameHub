const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
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
		unique: true,
		uniqueCaseInsensitive: true
	},
	password: {
		type: String,
		required: true,
		min: 8,
		max: 32
	}
});

UserSchema.plugin(uniqueValidator, {
	message: '{PATH} must be unique.'
});

module.exports = mongoose.model('user', UserSchema);
