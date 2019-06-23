import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_CONSOLE_BY_URL } from '../../graphql/queries';
import { Link } from 'react-router-dom';
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
        const { name, games } = data.consoleByURL;
        console.log(games);
        return (
          <div>
            <div className='console-detail-header'>{name}</div>
            <div className='console-detail-game-list'>
              {games.map((game, i) => {
                return (
                  <Link to={`/games/${game._id}`} key={i}>
                    <div className='console-game-list-item'>
                      <img src={game.imageURL} />
                      <div className='game-list-title'>{game.name}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default ConsoleDetail;
