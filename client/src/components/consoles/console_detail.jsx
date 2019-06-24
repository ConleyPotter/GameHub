import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLE_BY_URL } from '../../graphql/queries';
import { Link } from 'react-router-dom';
import TopRatedGames from './top_rated_games';
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
        const { name, topGames } = data.consoleByURL;
        return (
          <div>
            <div className='console-detail-header'>{name}</div>
            <TopRatedGames games={topGames} />
          </div>
        );
      }}
    </Query>
  );
};

export default ConsoleDetail;
