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
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      loggedIn
      username
    }
  }
`;

export const UPDATE_CURRENT_USER = gql`
  mutation UpdateCurrentUser($id: ID!, $username: String!) {
    updateCurrentUser(id: $id, username: $username) @client
  }
`;
