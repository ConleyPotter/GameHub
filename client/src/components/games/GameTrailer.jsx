import React from 'react';
import { withRouter } from 'react-router-dom';
import config from '../../config';
import './game_trailer.scss';

class GameTrailer extends React.Component {
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
			let { name, videoUrl, consoleName } = this.props;
			if (videoUrl) {
				let videoUrlPath = videoUrl.split('=')[1];
				videoUrl = `https://www.youtube.com/embed/${videoUrlPath}`;
			}
			if (!videoUrl && !this.state.videoUrl) {
				window.gapi.client.youtube.search
					.list({
						part: 'snippet',
						maxResults: 1,
						q: `${name} ${consoleName} Official Trailer`,
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
				<div className="game-trailer-container">
					<h3 className="detail-field-label main">Trailer</h3>
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
			);
		} else {
			return <p className="game-trailer-loading">'Loading Game Trailer...'</p>;
		}
	}
}

export default withRouter(GameTrailer);
