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

const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLBoolean } = graphql;

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
				description: { type: GraphQLString },
				releaseDate: { type: GraphQLString },
				videoUrl: { type: GraphQLString },
				console: { type: GraphQLID },
				imageURL: { type: GraphQLID },
				likes: { type: GraphQLInt },
				dislikes: { type: GraphQLInt }
			},
			resolve: async function(
				_,
				{ name, description, releaseDate, console, videoUrl, imageURL, likes, dislikes }
			) {
				const newGame = await new Game({
					name,
					description,
					releaseDate,
					videoUrl,
					console,
					imageURL,
					likes,
					dislikes
				}).save();
				return Game.findById(newGame._id).then(game => {
					return Console.findById(game.console).then(result => {
						result.games.push(game._id);
						result.save();
						return game.save();
					});
				});
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
				game: { type: new GraphQLNonNull(GraphQLID) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				title: { type: GraphQLString },
				content: { type: GraphQLString },
				liked: { type: new GraphQLNonNull(GraphQLBoolean) }
			},
			resolve: async function(_, { game, user, title, content, liked }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn && validUser._id == user) {
					const user = validUser._id;
					const newReview = await new Review({ user, game, title, content, liked }).save();
					await User.addReview({ userId: user, reviewId: newReview });
					const updatedGame = await Game.addReview({ gameId: game, reviewId: newReview, liked });
					return newReview;
				} else {
					throw new Error('Sorry, you need to be logged in to leave a review');
				}
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
		},
		updateReview: {
			type: ReviewType,
			args: {
				_id: { type: new GraphQLNonNull(GraphQLID) },
				title: { type: GraphQLString },
				content: { type: GraphQLString },
				liked: { type: new GraphQLNonNull(GraphQLBoolean) },
				user: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(_, args, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn && args.user == validUser._id) {
					return await Review.findById(args._id).then(review => {
						return Game.findById(review.game).then(async game => {
							if (args.liked && !review.liked) {
								game.dislikes--;
								game.likes++;
							} else if (!args.liked && review.liked) {
								game.likes--;
								game.dislikes++;
							}
							await game.save();
							review.title = args.title;
							review.content = args.content;
							review.liked = args.liked;
							review.date = Date.now();
							return await review.save();
						});
					});
				} else {
					throw new Error('Sorry, you need to be logged in to update a review');
				}
			}
		}
	}
});

module.exports = Mutation;
