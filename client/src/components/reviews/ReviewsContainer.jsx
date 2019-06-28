import React from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FETCH_CURRENT_USER_REVIEW, IS_LOGGED_IN } from '../../graphql/queries';
import ReviewList from './ReviewList';
import ReviewForm from '../forms/reviews/ReviewForm';
import './reviews_container.scss';

class ReviewsContainer extends React.Component {
	render() {
		const { gameId, reviews } = this.props;
		return (
			<div className="game-reviews">
				<Query query={IS_LOGGED_IN}>
					{({ data }) => {
						let currentUserId = data.currentUserId ? data.currentUserId : '';
						return (
							<Query
								query={FETCH_CURRENT_USER_REVIEW}
								variables={{
									gameId: this.props.match.params.gameId,
									userId: currentUserId
								}}
							>
								{({ loading, error, data }) => {
									if (loading) return 'Loading Review Form...';
									if (error) return `Error! ${error.message}`;
									let title = '';
									let content = '';
									let reviewId = '';
									let liked = 'neutral';
									let formMutation = 'new';
									if (data.currentUserReview && data.currentUserReview.user) {
										formMutation = 'update';
										reviewId = data.currentUserReview._id;
										title = data.currentUserReview.title;
										content = data.currentUserReview.content;
										liked = data.currentUserReview.liked;
										currentUserId = data.currentUserReview.user._id;
									}
									return (
										<ReviewForm
											gameId={gameId}
											title={title}
											content={content}
											liked={liked}
											formMutation={formMutation}
											reviewId={reviewId}
											currentUserId={currentUserId}
										/>
									);
								}}
							</Query>
						);
					}}
				</Query>

				<ReviewList reviews={reviews} />
			</div>
		);
	}
}

export default withRouter(ReviewsContainer);
