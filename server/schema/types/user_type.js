const mongoose = require('mongoose');
const User = mongoose.model('user');
const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = graphql;

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
    admin: {
      type: GraphQLBoolean
    },
    reviews: {
      type: new GraphQLList(require('./review_type')),
      resolve: async parentValue => {
        const reviews = await User.findReviews(parentValue._id);
        return _.sortBy(reviews, 'date').reverse();
      }
    },
    surveys: {
      type: new GraphQLList(require('./survey_type')),
      resolve(parentValue) {
        return User.findSurveys(parentValue._id);
      }
    }
  }
});

module.exports = UserType;
