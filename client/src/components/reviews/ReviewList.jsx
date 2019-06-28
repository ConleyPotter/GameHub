import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../services/format';
import './review_list.scss';

export default function ReviewIndex({ reviews, pageSource }) {
	const reviewsWithContent = reviews.filter(review => review.content);
	const reviewLis = reviewsWithContent.map(review => {
		const likedFlag = review.liked ? 'liked ' : 'disliked ';
		const linkBox =
			pageSource === 'userDetail' ? (
				<Link to={`/games/${review.game._id}`} className="user-info">
					<img
						className="avatar"
						src={`${review.game.imageURL ||
							'https://ryanacademy.ie/wp-content/uploads/2017/04/user-placeholder.png'}`}
						alt={`${review.game.imageURL} avatar`}
					/>
					<h5 className="game-name">{review.game.name}</h5>
					<p className="console-name">({review.game.console.name})</p>
				</Link>
			) : (
				<Link to={`/users/${review.user._id}`} className="user-info">
					<img
						className="avatar"
						src={`${review.user.avatar ||
							'https://ryanacademy.ie/wp-content/uploads/2017/04/user-placeholder.png'}`}
						alt={`${review.user.username} avatar`}
					/>
					<h5 className="username">{review.user.username}</h5>
				</Link>
			);
		return (
			<li className={`${likedFlag}review-list-item`} key={review._id}>
				{linkBox}
				<div className="review-details">
					<h5 className="title">{review.title}</h5>
					<p className="like-label">This user {likedFlag}this game.</p>
					<p className="content">{review.content}</p>
					<p className="publish-date">Review published: {formatDate(review.date)}</p>
				</div>
			</li>
		);
	});
	const noReviewMessage =
		pageSource === 'userDetail' ? (
			<p className="message">This user hasn't left any reviews yet.</p>
		) : (
			<p className="message">There don't seem to be any reviews yet... Leave the first one!</p>
		);
	return reviewLis.length > 0 ? (
		<div className="published-reviews">
			<h3 className="reviews-header detail-field-label">User Reviews</h3>
			<ul className="reviews-list">{reviewLis}</ul>
		</div>
	) : (
		<div className="no-reviews">
			<h3 className="reviews-header detail-field-label">User Reviews</h3>
			{noReviewMessage}
		</div>
	);
}
