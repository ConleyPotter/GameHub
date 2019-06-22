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
			gameConsole: console {
				name
			}
		}
	}
`;
