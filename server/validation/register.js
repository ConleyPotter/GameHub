const Validator = require('validator');
const validText = require('./valid_text');

module.exports = function validateInputs(data) {
	data.email = validText(data.email) ? data.email : '';
	data.username = validText(data.username) ? data.username : '';
	data.password = validText(data.password) ? data.password : '';

	if (!Validator.isEmail(data.email)) {
		return { message: 'Email is invalid', isValid: false };
	}

	if (Validator.isEmpty(data.email)) {
		return { message: 'Email field is required', isValid: false };
	}
	if (Validator.isEmpty(data.username)) {
		return { message: 'Username field is required', isValid: false };
	}

	if (!Validator.isLength(data.password, { min: 8, max: 32 })) {
		return { message: 'Password length must be between 8 and 32 characters', isValid: false };
	}

	return {
		message: '',
		isValid: true
	};
};
