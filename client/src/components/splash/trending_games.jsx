import React from 'react';
import { Query } from 'react-apollo';
import TopRatedGames from '../consoles/top_rated_games';
import { FETCH_TRENDING_GAMES } from '../../graphql/queries';

const TrendingGames = () => {
  return (
    <Query query={FETCH_TRENDING_GAMES}>
      {({ loading, error, data }) => {
        if (loading) return <div>loading...</div>;
        return (
          <div className='splash-top-games-container'>
            <div className='splash-top-games-header'>Trending Games</div>
            <TopRatedGames games={data.trending} />
          </div>
        );
      }}
    </Query>
  );
};

export default TrendingGames;
