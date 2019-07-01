import React from 'react';
import config from '../../config/keys';
import { withRouter } from 'react-router-dom';

class TrendingVideos extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loading: true };
	}

	componentDidMount() {
		window.gapi.load('client', () => {
			window.gapi.client.setApiKey(config.youtubeKey);
			window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest').then(() => {
				console.log('GAPI client loaded for API');
				window.gapi.client.youtube.search
					.list({
						part: 'snippet',
						maxResults: 4,
						q: `${this.props.consoleName}`,
						topicId: '/m/0bzvm2',
						type: 'video',
						relevanceLanguage: 'en',
						order: 'relevance'
					})
					.then(res => {
						const videos = res.result.items;
						console.log(res);
						this.setState({ videos, loading: false });
					});
			});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.consoleName !== this.props.match.params.consoleName) {
			this.setState({ loading: true });
		}
	}

	render() {
		const { videos, loading } = this.state;
		if (loading) return null;
		return (
			<div className="console-videos-list">
				{videos.map(video => {
					const title = video.snippet.title;
					const videoId = video.id.videoId;
					return (
						<div className="console-video">
							<iframe
								src={`https://www.youtube.com/embed/${videoId}`}
								frameBorder="0"
								allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								title={title}
							/>
						</div>
					);
				})}
			</div>
		);
	}
}

export default withRouter(TrendingVideos);
