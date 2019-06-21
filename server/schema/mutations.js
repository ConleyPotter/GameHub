const graphql = require('graphql');
const mongoose = require('mongoose');
const UserType = require('./user_type');
const User = mongoose.model('user');

const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { username, email, password }) {
        return new User({
          username,
          email,
          password
        }).save();
      }
    }
  }
});

module.exports = Mutation;
