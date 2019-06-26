import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_GAME, FETCH_CURRENT_USER_REVIEW, IS_LOGGED_IN } from '../../graphql/queries';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../forms/reviews/ReviewForm';
import GameTrailer from './GameTrailer';
import './game_detail.scss';

class GameDetail extends React.Component {
	render() {
		return (
			<Query query={FETCH_GAME} variables={{ id: this.props.match.params.gameId }}>
				{({ loading, error, data }) => {
					if (loading) return 'Loading...';
					if (error) return `Error! ${error.message}`;
					let {
						_id,
						name,
						description,
						releaseDate,
						imageURL,
						videoUrl,
						gameConsole,
						rating,
						reviews
					} = data.game;
					const consoleName = gameConsole.name;
					const coverImage = imageURL ? (
						<img className="cover-image" src={imageURL} alt={`${name} cover`} />
					) : null;

					return (
						<div className="display-page-full-container">
							<div className="game-detail-header">
								<div className="game-detail-header-inner-container">
									{coverImage}
									<div className="game-detail-header-content">
										<h1 className="game-title">{name}</h1>
										<p className="game-rating">
											<label className="detail-field-label">GameHub Rating: </label>
											{rating}
										</p>
									</div>
								</div>
							</div>
							<div className="display-page-container">
								<div className="game-detail">
									<aside className="game-detail-aside">
										<h3 className="detail-field-label">About</h3>
										<p className="console-name">
											<label className="detail-field-label">Console: </label>
											{consoleName}
										</p>
										<p className="release-date">
											<label className="detail-field-label">Release Date: </label>
											{releaseDate}
										</p>
									</aside>
									<main className="game-detail-main">
										<GameTrailer name={name} videoUrl={videoUrl} consoleName={consoleName} />
										<div className="game-description-container">
											<label className="detail-field-label">Description</label>
											<p className="game-description">{description}</p>
										</div>
									</main>
								</div>
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
														let previousReview = false;
														if (data.currentUserReview && data.currentUserReview.user) {
															previousReview = true;
															reviewId = data.currentUserReview._id;
															title = data.currentUserReview.title;
															content = data.currentUserReview.content;
															liked = data.currentUserReview.liked;
															currentUserId = data.currentUserReview.user._id;
														}
														return (
															<ReviewForm
																gameId={_id}
																title={title}
																content={content}
																liked={liked}
																previousReview={previousReview}
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
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default GameDetail;
