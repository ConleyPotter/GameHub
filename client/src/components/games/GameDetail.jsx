import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_GAME } from '../../graphql/queries';

class GameDetail extends React.Component {
	render() {
		return (
			<Query query={FETCH_GAME} variables={{ id: this.props.match.params.gameId }}>
				{({ loading, error, data }) => {
					if (loading) return 'Loading...';
					if (error) return `Error! ${error.message}`;
					const { id, name, description, releaseDate, videoUrl, gameConsole } = data.game;
					const consoleName = gameConsole.name;
					let featuredVideo;
					if (videoUrl) {
						featuredVideo = (
							<iframe
								src={videoUrl}
								frameBorder="0"
								allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								title={`${name} featured video`}
							/>
						);
					}
					return (
						<div>
							<h1>{name}</h1>
							{featuredVideo}
							<p>Console: {consoleName}</p>
							<p>{description}</p>
							<p>Release Date: {releaseDate}</p>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default GameDetail;
