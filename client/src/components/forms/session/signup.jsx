import React from 'react';
import { Mutation } from 'react-apollo';
import { REGISTER_USER } from '../../../graphql/mutations';
import { withRouter } from 'react-router-dom';
import './session_forms.scss';

class SignupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { username: '', email: '', password: '' };
	}

	handleSubmit(e, register) {
		e.preventDefault();
		register({
			variables: {
				email: this.state.email,
				username: this.state.username,
				password: this.state.password
			}
		}).then(() => this.props.closeModal());
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	updateCache(client, { data }) {
		client.writeData({
			data: { isLoggedIn: data.register.loggedIn }
		});
	}

	render() {
		return (
			<Mutation
				mutation={REGISTER_USER}
				onCompleted={data => {
					const { token } = data.register;
					localStorage.setItem('auth-token', token);
					this.props.history.push('/');
				}}
				update={(client, data) => this.updateCache(client, data)}
			>
				{register => (
					<div className="session-form-container">
						<form onSubmit={e => this.handleSubmit(e, register)}>
							<input
								value={this.state.username}
								onChange={this.update('username')}
								placeholder="Enter your username"
							/>
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
								Sign Up
							</button>
						</form>
					</div>
				)}
			</Mutation>
		);
	}
}

export default withRouter(SignupForm);
