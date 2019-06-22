import gql from 'graphql-tag';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const FETCH_CONSOLES = gql`
  {
    consoles {
      id
      name
    }
  }
`;
