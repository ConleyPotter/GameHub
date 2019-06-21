const graphql = require('graphql');
const mongoose = require('mongoose');
const UserType = require('./user_type');
const User = mongoose.model('user');
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
		}
	}
});

module.exports = Mutation;
