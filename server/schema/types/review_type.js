const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

const User = mongoose.model('user');
const Game = mongoose.model('game');

const ReviewType = new GraphQLObjectType({
	name: 'ReviewType',
	fields: () => ({
		_id: { type: GraphQLID },
		title: { type: GraphQLString },
		content: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return User.findById(parentValue.user)
					.then(user => user)
					.catch(err => console.log(err));
			}
		},
		game: {
			type: require('./game_type'),
			resolve(parentValue) {
				return Game.findById(parentValue.game)
					.then(game => game)
					.catch(err => console.log(err));
			}
		}
	})
});

module.exports = ReviewType;
