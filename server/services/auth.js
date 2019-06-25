const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretOrKey = require('../../config/keys').secretOrKey;
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

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

		const token = jwt.sign({ id: user._id }, secretOrKey);

		return { token, loggedIn: true, ...user._doc, password: null };
	} catch (err) {
		throw err;
	}
};

const logout = async data => {
	const { _id } = data;
	const leavingUser = await User.findById(_id);
	const token = '';
	return { token, loggedIn: false, ...leavingUser._doc, password: null };
};

const login = async data => {
	try {
		const { message, isValid } = validateLoginInput(data);

		if (!isValid) {
			throw new Error(message);
		}

		const { email, password } = data;
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('Email does not exist');
		}

		const passwordMatch = await bcrypt.compareSync(password, user.password);
		if (!passwordMatch) {
			throw new Error('Password does not match');
		}
		const token = await jwt.sign({ id: user._id }, secretOrKey);
		return { token, loggedIn: true, ...user._doc, password: null };
	} catch (err) {
		throw err;
	}
};

const verifyUser = async data => {
	try {
		console.log({ data });
		const { token } = data;
		console.log({ token });
		const decoded = await jwt.verify(token, secretOrKey);
		console.log({ decoded: decoded });
		const { id } = decoded;

		const loggedIn = await User.findById(id).then(user => {
			return user ? true : false;
		});

		return { loggedIn, id };
	} catch (err) {
		console.log({ err });
		return { loggedIn: false };
	}
};

module.exports = { register, logout, login, verifyUser };
