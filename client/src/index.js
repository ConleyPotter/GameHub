import React from 'react';
import ReactDOM from 'react-dom';
import './reset.scss';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from 'react-apollo';
import { HashRouter } from 'react-router-dom';
import { VERIFY_USER } from './graphql/mutations';

const cache = new InMemoryCache({
	dataIdFromObject: object => object._id || null
});
const token = localStorage.getItem('auth-token');
const currentUser = localStorage.getItem('currentUser');
const currentUserId = localStorage.getItem('currentUserId');

cache.writeData({
	data: {
		isLoggedIn: Boolean(token),
		currentUser,
		currentUserId
	}
});

const httpLink = createHttpLink({
	uri: 'http://localhost:5000/graphql'
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('auth-token');
	return {
		headers: {
			...headers,
			authorization: token ? token : ''
		}
	};
});

const errorLink = onError(({ graphQLErrors }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message }) => console.log(message));
	}
});

const client = new ApolloClient({
	link: authLink.concat(httpLink, errorLink),
	cache,
	onError: ({ networkError, graphQLErrors }) => {
		console.log('graphQLErrors', graphQLErrors);
		console.log('networkError', networkError);
	}
});

if (token) {
	client.mutate({ mutation: VERIFY_USER, variables: { token } }).then(({ data }) => {
		client.writeData({
			data: {
				isLoggedIn: data.verifyUser.loggedIn,
				currentUser: data.verifyUser.username,
				currentUserId: data.verifyUser._id
			}
		});
	});
} else {
	cache.writeData({
		data: {
			isLoggedIn: false,
			currentUser: '',
			currentUserId: ''
		}
	});
}

const Root = () => {
	return (
		<ApolloProvider client={client}>
			<HashRouter>
				<App />
			</HashRouter>
		</ApolloProvider>
	);
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
