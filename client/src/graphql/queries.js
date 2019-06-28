import gql from 'graphql-tag';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
    currentUser @client
    currentUserId @client
    admin @client
  }
`;

export const FETCH_USER = gql`
  query FetchUser($id: ID!) {
    user(id: $id) {
      _id
      username
      email
      reviews {
        _id
        title
        content
        liked
        date
        game {
          _id
          name
          imageURL
          console {
            _id
            name
          }
        }
        user {
          _id
          username
        }
      }
    }
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
      rating
      reviews {
        _id
        user {
          _id
          username
        }
        game {
          _id
          name
          imageURL
        }
        title
        content
        liked
        date
      }
      gameConsole: console {
        _id
        name
      }
    }
  }
`;

export const FETCH_GAMES = gql`
  query FetchGames($name: String!, $limit: Int) {
    games(name: $name, limit: $limit) {
      _id
      name
      imageURL
      console {
        name
        _id
      }
    }
  }
`;

export const FETCH_CONSOLES = gql`
  {
    consoles {
      _id
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

export const FETCH_TOP_GAMES_FOR_CONSOLES = gql`
  {
    consoles {
      _id
      name
      topGames {
        _id
        name
        imageURL
        rating
      }
    }
  }
`;

export const FETCH_TRENDING_GAMES = gql`
  {
    trending {
      _id
      name
      imageURL
      rating
      console {
        name
        _id
      }
    }
  }
`;

export const FETCH_CURRENT_USER_REVIEW = gql`
  query fetchCurrentUserReview($gameId: ID!, $userId: ID!) {
    currentUserReview(gameId: $gameId, userId: $userId) {
      _id
      title
      content
      liked
      date
      game {
        _id
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
          game {
            _id
            name
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
