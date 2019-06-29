const mongoose = require('mongoose');
const List = mongoose.model('list');
const User = mongoose.model('user');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ListType = new GraphQLObjectType({
	name: 'ListType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		user: {
			type: require('./user_type'),
			resolve(parentValue) {
				return User.findById(parentValue.user)
					.then(user => user)
					.catch(err => console.log(err));
			}
		},
		games: {
			type: new GraphQLList(require('./game_type')),
			resolve(parentValue) {
				return List.findbyId(parentValue._id)
					.populate('games')
					.then(list => list.games)
					.catch(err => console.log(err));
			}
		}
	})
});

module.exports = ListType;
