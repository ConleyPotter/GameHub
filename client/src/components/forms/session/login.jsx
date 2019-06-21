import React from 'react';
import { Mutation } from 'react-apollo';
import { LOGIN_USER } from '../../../graphql/mutations';
import { withRouter } from 'react-router-dom';
import './session_forms.css';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { email: '', password: '' };
	}

	handleSubmit(e, login) {
		e.preventDefault();
		login({
			variables: {
				email: this.state.email,
				password: this.state.password
			}
		});
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	updateCache(client, { data }) {
		client.writeData({
			data: { isLoggedIn: data.login.loggedIn }
		});
	}

	render() {
		return (
			<Mutation
				mutation={LOGIN_USER}
				onCompleted={data => {
					const { token } = data.login;
					localStorage.setItem('auth-token', token);
					this.props.history.push('/');
				}}
				update={(client, data) => this.updateCache(client, data)}
			>
				{login => (
					<div className="session-form-container">
						<form onSubmit={e => this.handleSubmit(e, login)}>
							<input
								value={this.state.email}
								onChange={this.update('email')}
								placeholder="Enter your email address"
							/>
							<input
								type="password"
								value={this.state.password}
								onChange={this.update('password')}
								placeholder="Enter your password"
							/>
							<button type="submit" className="session-button">
								Login
							</button>
						</form>
					</div>
				)}
			</Mutation>
		);
	}
}

export default withRouter(LoginForm);
