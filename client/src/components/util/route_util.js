import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';

const ProtectedRoute = ({ component: Component, path, exact, ...rest }) => (
	<Query query={IS_LOGGED_IN}>
		{({ data }) => {
			return (
				<Route
					path={path}
					exact={exact}
					render={props => (data.admin ? <Component {...props} /> : <Redirect to="/" />)}
				/>
			);
		}}
	</Query>
);

export default ProtectedRoute;
