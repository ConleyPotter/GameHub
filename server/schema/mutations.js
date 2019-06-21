const graphql = require('graphql');
const mongoose = require('mongoose');
const UserType = require('./user_type');
const User = mongoose.model('user');
const AuthService = require('../services/auth');

const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;

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
		}
	}
});

module.exports = Mutation;
