import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { FETCH_GAME, FETCH_CURRENT_USER_REVIEW } from '../../../graphql/queries';
import { CREATE_REVIEW, UPDATE_REVIEW, DELETE_REVIEW } from '../../../graphql/mutations';
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
			formMutation: this.props.formMutation,
			reviewId: this.props.reviewId,
			currentUserId: this.props.currentUserId,
			message: '',
			modalOpen: false,
			waiting: false
		};
		this.closeModal = this.closeModal.bind(this);
	}

	closeModal() {
		this.setState({ modalOpen: false });
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
				formMutation: this.props.formMutation,
				reviewId: this.props.reviewId,
				currentUserId: this.props.currentUserId,
				message: '',
				waiting: false
			});
		}
	}

	update(field) {
		return e => this.setState({ [field]: e.target.value });
	}

	updateCache(cache, { data }) {
		let resData;
		switch (this.state.formMutation) {
			case 'new':
				resData = data.newReview;
				break;
			case 'update':
				resData = data.updateReview;
				break;
			case 'delete':
				resData = data.deleteReview;
				break;
			default:
				break;
		}
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
			const newCachedGame = merge(game.game, resData.game);
			cache.writeQuery({
				query: FETCH_GAME,
				data: { game: newCachedGame }
				// data: { game: resData.game }
			});
		}
		if (userReview) {
			const newCachedReview = merge(userReview.currentUserReview, resData);
			cache.writeQuery({
				query: FETCH_CURRENT_USER_REVIEW,
				data: { currentUserReview: newCachedReview }
				// data: { currentUserReview: resData }
			});
		}
	}

	handleClick(field) {
		return e => {
			e.preventDefault();
			switch (this.state.formMutation) {
				case 'new':
					field === 'like'
						? this.state.liked === true
							? this.setState({ liked: 'neutral', message: '' })
							: this.setState({ liked: true, message: '' })
						: this.state.liked === false
							? this.setState({ liked: 'neutral', message: '' })
							: this.setState({ liked: false, message: '' });
					break;
				case 'update':
					field === 'like'
						? this.state.liked === true
							? this.setState({
									liked: 'neutral',
									message: 'Submitting will delete your review!',
									formMutation: 'delete'
								})
							: this.setState({ liked: true, message: '', formMutation: 'update' })
						: this.state.liked === false
							? this.setState({
									liked: 'neutral',
									message: 'Submitting will delete your review!',
									formMutation: 'delete'
								})
							: this.setState({ liked: false, message: '', formMutation: 'update' });
					break;
				case 'delete':
					field === 'like'
						? this.setState({ liked: true, message: '', formMutation: 'update' })
						: this.setState({ liked: false, message: '', formMutation: 'update' });
					break;
				default:
					break;
			}
		};
	}

	handleSubmit(e, submitReview) {
		e.preventDefault();
		if (this.state.waiting) {
			this.setState({ message: 'Slow down there, buddy!' });
			return;
		}
		if (this.state.liked === 'neutral' && this.state.formMutation === 'new') {
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
		this.setState({ waiting: true });
	}

	render() {
		let formMutation;
		let buttonText;
		let successMessage;
		switch (this.state.formMutation) {
			case 'new':
				formMutation = CREATE_REVIEW;
				buttonText = 'Post Review';
				successMessage = 'New review created successfully';
				break;
			case 'update':
				formMutation = UPDATE_REVIEW;
				buttonText = 'Update Review';
				successMessage = 'Review updated successfully';
				break;
			case 'delete':
				formMutation = DELETE_REVIEW;
				buttonText = 'Delete Review';
				successMessage = 'Review deleted successfully';
				break;
			default:
				break;
		}
		return (
			<Mutation
				mutation={formMutation}
				onError={err => this.setState({ message: err.message })}
				update={(cache, data) => this.updateCache(cache, data)}
				onCompleted={data => {
					let reviewId;
					let nextFormMutation;
					if (data.updateReview) {
						reviewId = this.state.reviewId;
						nextFormMutation = 'update';
					} else if (data.newReview) {
						reviewId = data.newReview._id;
						nextFormMutation = 'update';
					} else {
						reviewId = '';
						nextFormMutation = 'new';
					}
					this.setState({
						formMutation: nextFormMutation,
						reviewId,
						message: successMessage,
						waiting: false
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
									{buttonText}
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
