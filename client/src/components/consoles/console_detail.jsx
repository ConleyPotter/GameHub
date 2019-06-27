import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLE_BY_URL } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import TopRatedGames from './top_rated_games';
import UpcomingGames from './upcoming_games';
import './console_detail.scss';

const ConsoleDetail = props => {
  return (
    <Query
      query={FETCH_CONSOLE_BY_URL}
      variables={{ url: props.match.params.consoleName }}
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return error.message;
        const { name, imageURL, topGames, upcomingGames } = data.consoleByURL;
        return (
          <div className='console-detail-container'>
            <div className='console-detail-header'>
              <div className='console-detail-hero-image'>
                <img src={imageURL} alt={`${name} photo`} />
                {name}
              </div>
            </div>
            <div className='console-detail-game-lists'>
              <div className='console-top-games-container'>
                <div className='console-top-games-header'>Top Rated Games</div>
                <TopRatedGames games={topGames} />
              </div>
              <UpcomingGames games={upcomingGames} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default ConsoleDetail;
