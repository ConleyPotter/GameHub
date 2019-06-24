import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_GAME } from '../../graphql/queries';
import config from '../../config';
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
      window.gapi.client
        .load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
        .then(() => {
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
        <Query
          query={FETCH_GAME}
          variables={{ id: this.props.match.params.gameId }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            let {
              id,
              name,
              description,
              releaseDate,
              imageURL,
              videoUrl,
              gameConsole
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
            let coverImage;
            if (imageURL)
              coverImage = (
                <img
                  className='cover-image'
                  src={imageURL}
                  alt={`${name} cover`}
                />
              );

            return (
              <div className='display-page-container'>
                <div className='game-detail-container'>
                  <div className='game-detail-header'>
                    {coverImage}
                    <h1 className='game-title'>{name}</h1>
                  </div>
                  <h3 className='detail-field-label'>Trailer:</h3>
                  <div className='game-video-container'>
                    <iframe
                      className='game-video'
                      src={videoUrl || this.state.videoUrl}
                      frameBorder='0'
                      allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={`${name} featured video`}
                    />
                  </div>
                  <p className='console-name'>
                    <label className='detail-field-label'>Console: </label>
                    {consoleName}
                  </p>
                  <p className='release-date'>
                    <label className='detail-field-label'>Release Date: </label>
                    {releaseDate}
                  </p>
                  <p className='game-description'>{description}</p>
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
