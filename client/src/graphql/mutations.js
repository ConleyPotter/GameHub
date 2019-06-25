import gql from 'graphql-tag';

export const REGISTER_USER = gql`
	mutation RegisterUser($email: String!, $password: String!, $username: String!) {
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
	mutation CreateReview($game: ID!, $title: String, $content: String, $liked: Boolean!) {
		newReview(game: $game, title: $title, content: $content, liked: $liked) {
			_id
			title
			content
			liked
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
	mutation UpdateReview($_id: ID!, $title: String, $content: String, $liked: Boolean!) {
		updateReview(_id: $_id, title: $title, content: $content, liked: $liked) {
			_id
			title
			content
			liked
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
				}
			}
			user {
				_id
				username
			}
		}
	}
`;
