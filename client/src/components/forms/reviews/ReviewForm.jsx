import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { FETCH_GAME, FETCH_CURRENT_USER_REVIEW } from '../../../graphql/queries';
import { CREATE_REVIEW, UPDATE_REVIEW } from '../../../graphql/mutations';
import { merge } from 'lodash';
import LoginModal from '../../modal';
import './review_form.scss';

class ReviewForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: this.props.title,
			content: this.props.content,
			game: this.props.gameId,
			liked: this.props.liked,
			editing: this.props.previousReview,
			reviewId: this.props.reviewId,
			currentUserId: this.props.currentUserId,
			message: '',
			modalOpen: false
		};
		this.closeModal = this.closeModal.bind(this);
	}

	closeModal() {
		this.setState({ modalOpen: false, modalType: null });
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.match.params.gameId !== this.props.match.params.gameId ||
			prevProps.currentUserId !== this.props.currentUserId
		) {
			this.setState({
				title: this.props.title,
				content: this.props.content,
				game: this.props.gameId,
				liked: this.props.liked,
				editing: this.props.previousReview,
				reviewId: this.props.reviewId,
				currentUserId: this.props.currentUserId,
				message: ''
			});
		}
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	updateCache(cache, { data }) {
		let game;
		let userReview;
		try {
			game = cache.readQuery({ query: FETCH_GAME, variables: { id: this.state.game } });
			userReview = cache.readQuery({
				query: FETCH_CURRENT_USER_REVIEW,
				variables: { gameId: this.state.game, userId: this.state.currentUserId }
			});
		} catch (err) {
			return;
		}
		if (game) {
			const newCachedGame = this.state.editing
				? merge(game.game, data.updateReview.game)
				: merge(game.game, data.newReview.game);
			cache.writeQuery({
				query: FETCH_GAME,
				data: { game: newCachedGame }
			});
		}
		if (userReview) {
			const newCachedReview = this.state.editing
				? merge(userReview.currentUserReview, data.updateReview)
				: merge(userReview.currentUserReview, data.newReview);
			cache.writeQuery({
				query: FETCH_CURRENT_USER_REVIEW,
				data: { currentUserReview: newCachedReview }
			});
		}
	}

	handleClick(field) {
		return e => {
			e.preventDefault();
			field === 'like'
				? this.setState({ liked: true, message: '' })
				: this.setState({ liked: false, message: '' });
		};
	}

	handleSubmit(e, submitReview) {
		e.preventDefault();
		if (this.state.liked === 'neutral') {
			this.setState({ message: 'Select either "Like" or "Dislike" above' });
			return;
		}
		if (!this.state.currentUserId) {
			this.setState({ modalOpen: true });
			return;
		}
		submitReview({
			variables: {
				_id: this.state.reviewId,
				title: this.state.title,
				content: this.state.content,
				game: this.state.game,
				liked: this.state.liked,
				user: this.state.currentUserId
			}
		});
	}

	render() {
		const formMutation = this.state.editing ? UPDATE_REVIEW : CREATE_REVIEW;
		return (
			<Mutation
				mutation={formMutation}
				onError={err => this.setState({ message: err.message })}
				update={(cache, data) => this.updateCache(cache, data)}
				onCompleted={data => {
					const reviewId = data.updateReview ? this.state.reviewId : data.newReview._id;
					this.setState({
						editing: true,
						reviewId,
						message: `${this.state.editing ? 'Review updated' : 'New review created'} successfully`
					});
				}}
			>
				{(submitReview, { data }) => (
					<div className="review-form-container">
						<h3 className="form-header detail-field-label">Write a Review</h3>
						<form className="review-form" onSubmit={e => this.handleSubmit(e, submitReview)}>
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
								/>
							</div>
							<div className="review-form-buttons-container">
								<button
									className={`${this.state.liked === true
										? 'liked '
										: ''}like-button review-form-button`}
									onClick={this.handleClick('like')}
								>
									Like
								</button>
								<button
									className={`${this.state.liked === false
										? 'disliked '
										: ''}dislike-button review-form-button`}
									onClick={this.handleClick('dislike')}
								>
									Dislike
								</button>
								<button
									className={`${this.state.liked === true
										? 'liked '
										: this.state.liked === false
											? 'disliked '
											: ''}submit-button review-form-button`}
									type="submit"
								>
									{this.state.editing ? 'Update Review' : 'Post Review'}
								</button>
							</div>
						</form>
						<p>{this.state.message}</p>
						{this.state.modalOpen && <LoginModal type="login" closeModal={this.closeModal} />}
					</div>
				)}
			</Mutation>
		);
	}
}

export default withRouter(ReviewForm);
