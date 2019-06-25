import React from 'react';
import { Mutation } from 'react-apollo';
import { FETCH_GAME } from '../../../graphql/queries';
import { CREATE_REVIEW } from '../../../graphql/mutations';
import { merge } from 'lodash';

class ReviewForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			content: '',
			game: this.props.gameId,
			message: ''
		};
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	updateCache(cache, { data }) {
		let game;
		try {
			game = cache.readQuery({ query: FETCH_GAME, variables: { id: this.state.game } });
		} catch (err) {
			return;
		}

		if (game) {
			const newCachedGame = merge(game, { reviews: data.game.reviews });
			cache.writeQuery({
				query: FETCH_GAME,
				data: { game: newCachedGame }
			});
		}
	}

	handleSubmit(e, createReview) {
		e.preventDefault();
		console.log(this.state);

		createReview({
			variables: {
				title: this.state.title,
				content: this.state.content,
				game: this.state.game
			}
		});
	}

	render() {
		return (
			<Mutation
				mutation={CREATE_REVIEW}
				onError={err => this.setState({ message: err.message })}
				update={(cache, data) => this.updateCache(cache, data)}
				onCompleted={data => {
					this.setState({
						message: `New review created successfully`
					});
				}}
			>
				{(createReview, { data }) => (
					<div className="review-form-container">
						<form className="review-form" onSubmit={e => this.handleSubmit(e, createReview)}>
							<div className="title-container">
								<label className="title-label detail-field-label">Title: </label>
								<input
									className="title-input"
									type="text"
									onChange={this.update('title')}
									value={this.state.title}
									placeholder="Ex: I loved this game!"
								/>
							</div>
							<div className="content-container">
								<textarea
									className="content-input"
									onChange={this.update('content')}
									value={this.state.content}
									placeholder="Share your thoughts!"
									cols="30"
									rows="10"
								/>
							</div>
							<button className="review-form-submit" type="submit">
								Post Review
							</button>
						</form>
						<p>{this.state.message}</p>
					</div>
				)}
			</Mutation>
		);
	}
}

export default ReviewForm;
