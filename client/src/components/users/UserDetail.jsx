import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_USER } from '../../graphql/queries';
import ReviewList from '../reviews/ReviewList';
import AdminMain from '../admin/admin_main';
import './user_detail.scss';

const UserDetail = props => {
	return (
		<Query query={FETCH_USER} variables={{ id: props.match.params.userId }}>
			{({ loading, error, data }) => {
				if (loading) return 'Loading...';
				if (error) return `Error! ${error.message}`;
				let { username, email, reviews, avatar } = data.user;

				return (
					<div className="user-detail-container">
						<div className="user-info-container fade-background">
							<img
								className="avatar"
								src={`${avatar ||
									'https://ryanacademy.ie/wp-content/uploads/2017/04/user-placeholder.png'}`}
								alt={`${username} avatar`}
							/>
							<h5 className="username">{username}</h5>
							<a href={`mailto:${email}`} className="email">
								{email}
							</a>
							<AdminMain />
						</div>
						<ReviewList reviews={reviews} pageSource="userDetail" />
					</div>
				);
			}}
		</Query>
	);
};

export default UserDetail;
