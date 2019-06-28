import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { FETCH_GAME } from '../../graphql/queries';
import { consoleDisplayToLink } from '../../services/format';
import ReviewsContainer from '../reviews/ReviewsContainer';
import GameTrailer from './GameTrailer';
import GameRating from './GameRating';
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
										<div className="about-container fade-background">
											<h3 className="detail-field-label main">About</h3>
											<p className="console-name">
												<label className="detail-field-label">Console: </label>
												<Link to={`/${consoleDisplayToLink(consoleName)}`}>{consoleName}</Link>
											</p>
											<p className="release-date">
												<label className="detail-field-label">Release Date: </label>
												{releaseDate}
											</p>
											<div className="rating-meter-container">
												<h3 className="detail-field-label">GameHub Rating:</h3>
												<GameRating rating={rating} />
											</div>
										</div>
									</aside>
									<main className="game-detail-main">
										<GameTrailer name={name} videoUrl={videoUrl} consoleName={consoleName} />
										<div className="game-description-container">
											<label className="detail-field-label">Description</label>
											<p className="game-description">{description}</p>
										</div>
									</main>
								</div>
								<div className="fade-divide" />
								<ReviewsContainer gameId={_id} reviews={reviews} />
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default GameDetail;
