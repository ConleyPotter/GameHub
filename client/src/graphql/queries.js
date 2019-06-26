import gql from 'graphql-tag';

export const IS_LOGGED_IN = gql`
	query IsUserLoggedIn {
		isLoggedIn @client
		currentUser @client
		currentUserId @client
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
				title
				content
				liked
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
      }
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

export const FETCH_CURRENT_USER_REVIEW = gql`
	query fetchCurrentUserReview($gameId: ID!, $userId: ID!) {
		currentUserReview(gameId: $gameId, userId: $userId) {
			_id
			title
			content
			liked
			game {
				_id
				rating
				reviews {
					_id
					title
					content
					liked
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
