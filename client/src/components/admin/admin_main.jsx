import React from 'react';
import Modal from '../modal';
import { Query } from 'react-apollo';
import { IS_LOGGED_IN } from '../../graphql/queries';

class AdminMain extends React.Component {
	constructor(props) {
		super(props);
		this.state = { modalOpen: false };
		this.closeModal = this.closeModal.bind(this);
	}

	closeModal() {
		this.setState({ modalOpen: false });
	}

	render() {
		return (
			<Query query={IS_LOGGED_IN}>
				{({ data }) => {
					return !data.admin ? null : (
						<div className="admin-main-container">
							<div className="add-game-modal-open">
								<button onClick={() => this.setState({ modalOpen: true })} className="session-button">
									Add Game
								</button>
							</div>
							{this.state.modalOpen && <Modal type={'addGame'} closeModal={this.closeModal} />}
						</div>
					);
				}}
			</Query>
		);
	}
}
export default AdminMain;
