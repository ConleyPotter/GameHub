import React from 'react';
import './review_list.scss';

export default function ReviewIndex({ reviews }) {
	const reviewLis = reviews.map(review => (
		<li className="review-list-item" key={review._id}>
			<div className="user-info">
				<img className="avatar" src={`${review.user.avatar}`} alt={`${review.user.username} avatar`} />
				<h5 className="username">{review.user.username}</h5>
			</div>
			<div className="review-details">
				<h3 className="title">{review.title}</h3>
				<p className="content">{review.content}</p>
			</div>
		</li>
	));
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
