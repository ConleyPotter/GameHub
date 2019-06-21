const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../validation/register');

const register = async data => {
	try {
		const { message, isValid } = validateRegisterInput(data);

		if (!isValid) {
			throw new Error(message);
		}

		const { username, email, password } = data;

		let existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new Error('This email already exists');
		}

		existingUser = await User.findOne({ username });

		if (existingUser) {
			throw new Error('This username already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User(
			{
				username,
				email,
				password: hashedPassword
			},
			err => {
				if (err) throw err;
			}
		);

		user.save();

		const token = jwt.sign({ id: user._id }, keys.secretOrKey);

		return { token, loggedIn: true, ...user._doc, password: null };
	} catch (err) {
		throw err;
	}
};

module.exports = { register };
