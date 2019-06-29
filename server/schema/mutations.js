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
const SurveyType = require('./types/survey_type');
const Survey = mongoose.model('survey');
const ListType = require('./types/list_type');
const List = mongoose.model('list');
const AuthService = require('../services/auth');
const lodash = require('lodash');

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
				imageURL: { type: GraphQLString },
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
					const newReview = await new Review({
						user,
						game,
						title,
						content,
						liked
					}).save();
					await User.addReview({ userId: user, reviewId: newReview });
					const updatedGame = await Game.addReview({
						gameId: game,
						reviewId: newReview,
						liked
					});
					return newReview;
				} else {
					throw new Error('Sorry, you need to be logged in to leave a review');
				}
			}
		},
		newSurvey: {
			type: SurveyType,
			args: {
				console: { type: new GraphQLNonNull(GraphQLID) },
				user: { type: new GraphQLNonNull(GraphQLID) },
				favoriteGameOf2019: { type: new GraphQLNonNull(GraphQLID) },
				favoriteGameOf2018: { type: new GraphQLNonNull(GraphQLID) },
				mostAnticipatedGame: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(
				_,
				{ console, user, favoriteGameOf2019, favoriteGameOf2018, mostAnticipatedGame },
				ctx
			) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn && validUser._id == user) {
					const user = validUser._id;
					const newSurvey = await new Survey({
						user,
						console,
						favoriteGameOf2019,
						favoriteGameOf2018,
						mostAnticipatedGame
					}).save();
					await User.addSurvey({ userId: user, surveyId: newSurvey });
					return newSurvey;
				} else {
					throw new Error('Sorry, you need to be logged in to leave a reivew.');
				}
			}
		},
		deleteReview: {
			type: ReviewType,
			args: {
				_id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(_, { _id }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn) {
					return await Review.findById(_id).then(review => {
						return Game.findById(review.game).then(async game => {
							return User.findById(review.user).then(async user => {
								review.liked ? game.likes-- : game.dislikes--;
								game.reviewsLength--;
								lodash.remove(game.reviews, review => review._id == _id);
								const after = await game.save();
								lodash.remove(user.reviews, review => review._id == _id);
								await user.save();
								return await review.remove();
							});
						});
					});
				} else {
					throw new Error('Sorry, you need to be logged in to update a review');
				}
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
		},
		newList: {
			type: ListType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve: async function(_, { name }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn) {
					const user = validUser._id;
					const newList = await new List({ user, name }).save();
					await User.addList({ userId: user, listId: newList });
					return newList;
				} else {
					throw new Error('Sorry, you need to be logged in to create a list');
				}
			}
		},
		addToList: {
			type: ListType,
			args: {
				listId: { type: new GraphQLNonNull(GraphQLID) },
				gameId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(_, { listId, gameId }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn) {
					return await List.findById(listId).then(async list => {
						if (!list.games.includes(gameId)) list.games.push(gameId);
						return await list.save();
					});
				} else {
					throw new Error('Sorry, you need to be logged in to update a list');
				}
			}
		},
		removeFromList: {
			type: ListType,
			args: {
				listId: { type: new GraphQLNonNull(GraphQLID) },
				gameId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(_, { listId, gameId }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn) {
					return await List.findById(listId).then(async list => {
						list.games = list.games.filter(game => game !== gameId);
						return await list.save();
					});
				} else {
					throw new Error('Sorry, you need to be logged in to update a list');
				}
			}
		},
		updateListName: {
			type: ListType,
			args: {
				listId: { type: new GraphQLNonNull(GraphQLID) },
				name: new GraphQLNonNull(GraphQLString)
			},
			resolve: async function(_, { listId, name }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn) {
					return await List.findOneAndUpdate(
						{ _id: listId },
						{ $set: { name } },
						{ returnNewDocument: true }
					);
				} else {
					throw new Error('Sorry, you need to be logged in to update a list');
				}
			}
		},
		deleteList: {
			type: ListType,
			args: {
				listId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: async function(_, { listId }, ctx) {
				const validUser = await AuthService.verifyUser({ token: ctx.token });
				if (validUser.loggedIn) {
					return await List.findById(listId).then(list => {
						return User.findById(list.user).then(async user => {
							lodash.remove(user.lists, list => list._id == listId);
							await user.save();
							return await list.remove();
						});
					});
				} else {
					throw new Error('Sorry, you need to be logged in to delete a list');
				}
			}
		}
	}
});

module.exports = Mutation;
