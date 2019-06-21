const graphql = require('graphql');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql;

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
		}
	}
});

module.exports = UserType;
