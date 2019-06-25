import gql from 'graphql-tag';

export const IS_LOGGED_IN = gql`
	query IsUserLoggedIn {
		isLoggedIn @client
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
					username
				}
				title
				content
				liked
			}
			gameConsole: console {
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
	query fetchCurrentUserReview($gameId: ID!) {
		currentUserReview(gameId: $gameId) {
			_id
			title
			content
			liked
		}
	}
`;
