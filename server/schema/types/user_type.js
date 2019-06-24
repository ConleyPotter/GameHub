const mongoose = require('mongoose');
const User = mongoose.model('user');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList } = graphql;

const UserType = new GraphQLObjectType({
	name: 'UserType',
	fields: {
		_id: {
			type: GraphQLID
		},
		username: {
			type: GraphQLString
		},
		email: {
			type: GraphQLString
		},
		token: {
			type: GraphQLString
		},
		loggedIn: {
			type: GraphQLBoolean
		},
		reviews: {
			type: new GraphQLList(require('./review_type')),
			resolve(parentValue) {
				return User.findReviews(parentValue._id);
			}
		}
	}
});

module.exports = UserType;
