import React from 'react';
import { formatDate } from '../../services/format';
import './review_list.scss';

export default function ReviewIndex({ reviews }) {
	const reviewsWithContent = reviews.filter(review => review.content);
	const reviewLis = reviewsWithContent.map(review => {
		const likedFlag = review.liked ? 'liked ' : 'disliked ';
		return (
			<li className={`${likedFlag}review-list-item`} key={review._id}>
				<div className="user-info">
					<img
						className="avatar"
						src={`${review.user.avatar ||
							'https://ryanacademy.ie/wp-content/uploads/2017/04/user-placeholder.png'}`}
						alt={`${review.user.username} avatar`}
					/>
					<h5 className="username">{review.user.username}</h5>
				</div>
				<div className="review-details">
					<h3 className="title">{review.title}</h3>
					<p className="like-label">This user {likedFlag}this game.</p>
					<p className="content">{review.content}</p>
					<p className="publish-date">Review published: {formatDate(review.date)}</p>
				</div>
			</li>
		);
	});
	return reviewLis.length > 0 ? (
		<div className="published-reviews">
			<h3 className="detail-field-label">User Reviews</h3>
			<ul className="reviews-list">{reviewLis}</ul>
		</div>
	) : (
		<div className="no-reviews">
			<h3 className="detail-field-label">User Reviews</h3>
			<p className="message">There don't seem to be any reviews yet... Leave the first one!</p>
		</div>
	);
}
