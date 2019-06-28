import gql from 'graphql-tag';

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $username: String!
  ) {
    register(email: $email, password: $password, username: $username) {
      token
      loggedIn
      username
      _id
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      loggedIn
      username
      _id
      admin
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      loggedIn
      username
      _id
    }
  }
`;

export const UPDATE_CURRENT_USER = gql`
  mutation UpdateCurrentUser($id: ID!, $username: String!) {
    updateCurrentUser(id: $id, username: $username) @client
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $game: ID!
    $user: ID!
    $title: String
    $content: String
    $liked: Boolean!
  ) {
    newReview(
      game: $game
      user: $user
      title: $title
      content: $content
      liked: $liked
    ) {
      _id
      title
      content
      liked
      date
      game {
        _id
        likes
        dislikes
        rating
        reviews {
          _id
          title
          content
          liked
          date
          user {
            _id
            username
          }
        }
      }
      user {
        _id
        username
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview(
    $_id: ID!
    $user: ID!
    $title: String
    $content: String
    $liked: Boolean!
  ) {
    updateReview(
      _id: $_id
      user: $user
      title: $title
      content: $content
      liked: $liked
    ) {
      _id
      title
      content
      liked
      date
      game {
        _id
        likes
        dislikes
        rating
        reviews {
          _id
          title
          content
          liked
          date
          user {
            _id
            username
          }
        }
      }
      user {
        _id
        username
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($_id: ID!) {
    deleteReview(_id: $_id) {
      _id
      title
      content
      liked
      date
      game {
        _id
        likes
        dislikes
        rating
        reviews {
          _id
          title
          content
          liked
          date
          user {
            _id
            username
          }
        }
      }
      user {
        _id
        username
      }
    }
  }
`;
