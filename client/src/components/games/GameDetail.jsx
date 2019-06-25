import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_GAME, FETCH_CURRENT_USER_REVIEW, FETCH_CURRENT_USER_ID } from '../../graphql/queries';
import config from '../../config';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../forms/reviews/ReviewForm';
import './game_detail.scss';

class GameDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gapiReady: false
		};
	}

	componentDidMount() {
		window.gapi.load('client', () => {
			window.gapi.client.setApiKey(config.youtubeKey);
			window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest').then(() => {
				console.log('GAPI client loaded for API');
				this.setState({ gapiReady: true });
			});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.gameId !== this.props.match.params.gameId) {
			this.setState({ videoUrl: '' });
		}
	}

	render() {
		if (this.state.gapiReady) {
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
						if (videoUrl) {
							let videoUrlPath = videoUrl.split('=')[1];
							videoUrl = `https://www.youtube.com/embed/${videoUrlPath}`;
						}
						const consoleName = gameConsole.name;
						if (!videoUrl && !this.state.videoUrl) {
							window.gapi.client.youtube.search
								.list({
									part: 'snippet',
									maxResults: 1,
									q: `${name} Official Trailer`,
									safeSearch: 'strict',
									topicId: '/m/0bzvm2',
									type: 'video',
									videoEmbeddable: 'true'
								})
								.then(response => {
									const videoId = response.result.items[0].id.videoId;
									videoUrl = `https://www.youtube.com/embed/${videoId}`;
									this.setState({ videoUrl });
								});
						}
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
											<div className="game-trailer-container">
												<h3 className="detail-field-label">Trailer</h3>
												<div className="game-video-container">
													<iframe
														className="game-video"
														src={videoUrl || this.state.videoUrl}
														frameBorder="0"
														allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
														allowFullScreen
														title={`${name} featured video`}
													/>
												</div>
											</div>
											<div className="game-description-container">
												<label className="detail-field-label">Description</label>
												<p className="game-description">{description}</p>
											</div>
										</main>
									</div>
									<div className="game-reviews">
										<Query query={FETCH_CURRENT_USER_ID}>
											{({ data }) => {
												let currentUserId = data.currentUserId ? data.currentUserId : '';
												console.log(data);
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
															console.log(data);
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
		} else {
			return 'Loading...';
		}
	}
}

export default GameDetail;
