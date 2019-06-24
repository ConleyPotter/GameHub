const graphql = require('graphql');
const mongoose = require('mongoose');
const UserType = require('./types/user_type');
const User = mongoose.model('user');
const GameType = require('./types/game_type');
const Game = mongoose.model('game');
const ConsoleType = require('./types/console_type');
const Console = mongoose.model('console');
const ReviewType = require('./types/review_type');
const Review = mongoose.model('review');
const AuthService = require('../services/auth');

const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = graphql;

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		register: {
			type: UserType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(_, args) {
				return AuthService.register(args);
			}
		},
		logout: {
			type: UserType,
			args: {
				_id: { type: GraphQLID }
			},
			resolve(_, args) {
				return AuthService.logout(args);
			}
		},
		login: {
			type: UserType,
			args: {
				email: { type: GraphQLString },
				password: { type: GraphQLString }
			},
			resolve(_, args) {
				return AuthService.login(args);
			}
		},
		verifyUser: {
			type: UserType,
			args: {
				token: { type: GraphQLString }
			},
			resolve(_, args) {
				return AuthService.verifyUser(args);
			}
		},
		newGame: {
			type: GameType,
			args: {
				name: { type: GraphQLString },
				// user: { type: GraphQLID },
				description: { type: GraphQLString },
				releaseDate: { type: GraphQLString },
				videoUrl: { type: GraphQLString },
				console: { type: GraphQLID }
			},
			resolve(_, { name, description, releaseDate, console, videoUrl }) {
				return new Game({ name, description, releaseDate, videoUrl, console }).save();
			}
		},
		deleteGame: {
			type: GameType,
			args: { id: { type: GraphQLID } },
			resolve(_, { id }) {
				return Game.deleteOne({ _id: id });
			}
		},
		newConsole: {
			type: ConsoleType,
			args: {
				name: { type: GraphQLString }
			},
			resolve(_, { name }) {
				return new Console({ name }).save();
			}
		},
		deleteConsole: {
			type: ConsoleType,
			args: { id: { type: GraphQLID } },
			resolve(_, { id }) {
				return Console.deleteOne({ _id: id });
			}
		},
		newReview: {
			type: ReviewType,
			args: {
				user: { type: new GraphQLNonNull(GraphQLID) },
				game: { type: new GraphQLNonNull(GraphQLID) },
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(_, { user, game, title, content }) {
				const newReview = await new Review({ user, game, title, content }).save();
				await User.addReview({ userId: user, reviewId: newReview });
				await Game.addReview({ gameId: game, reviewId: newReview });
				return newReview;
			}
		},
		deleteReview: {
			type: ReviewType,
			args: {
				_id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(_, { _id }) {
				return Review.remove({ _id });
			}
		}
	}
});

module.exports = Mutation;
