const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'review'
		}
	]
});

UserSchema.statics.findReviews = function(userId) {
	return this.findById(userId)
		.populate('reviews')
		.then(user => user.reviews);
};

UserSchema.statics.addReview = function({ userId, reviewId }) {
	const User = mongoose.model('user');
	const Review = mongoose.model('review');

	return User.findById(userId).then(user => {
		return Review.findById(reviewId).then(async review => {
			user.reviews.push(review);
			return await user.save();
		});
	});
};

module.exports = mongoose.model('user', UserSchema);
