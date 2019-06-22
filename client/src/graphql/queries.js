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

export const FETCH_CONSOLE_BY_URL = gql`
  query fetchConsoleByURL($url: String!) {
    consoleByURL(url: $url) {
      name
      _id
      games {
        name
        description
      }
    }
  }
`;
