const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const Game = mongoose.model('game');
const Console = mongoose.model('console');

const GameType = new GraphQLObjectType({
	name: 'GameType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		releaseDate: { type: GraphQLString },
		imageURL: { type: GraphQLString },
		videoUrl: { type: GraphQLString },
		console: {
			type: require('./console_type'),
			resolve(parentValue) {
				return Console.findById(parentValue.console)
					.then(console => console)
					.catch(err => console.log(err));
			}
		},
		reviews: {
			type: new GraphQLList(require('./review_type')),
			resolve(parentValue) {
				return Game.findReviews(parentValue._id);
			}
		}
	})
});

module.exports = GameType;
