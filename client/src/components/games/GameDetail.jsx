import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_GAME } from '../../graphql/queries';
import config from '../../config';

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
						let { id, name, description, releaseDate, videoUrl, gameConsole } = data.game;
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

						return (
							<div>
								<h1>{name}</h1>
								<iframe
									src={videoUrl || this.state.videoUrl}
									frameBorder="0"
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									title={`${name} featured video`}
								/>
								<p>Console: {consoleName}</p>
								<p>{description}</p>
								<p>Release Date: {releaseDate}</p>
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
