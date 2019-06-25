import gql from 'graphql-tag';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
    currentUser @client
  }
`;

export const FETCH_GAME = gql`
  query FetchGame($id: ID!) {
    game(id: $id) {
      _id
      name
      description
      releaseDate
      videoUrl
      imageURL
      gameConsole: console {
        name
      }
    }
  }
`;

export const FETCH_GAMES = gql`
  query FetchGaames($name: String!) {
    games(name: $name) {
      _id
      name
      imageURL
    }
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
      imageURL
      _id
      topGames {
        _id
        name
        imageURL
        rating
      }
      upcomingGames {
        _id
        name
        imageURL
        releaseDate
      }
    }
  }
`;
