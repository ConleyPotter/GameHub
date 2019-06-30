import React from 'react';
import { Query } from 'react-apollo';
import { FETCH_GAME } from '../../graphql/queries';
import { Link } from 'react-router-dom';

const GameOfTheWeek = () => {
  return (
    <Query query={FETCH_GAME} variables={{ id: '5d118bac89086375e27ce8c5' }}>
      {({ loading, error, data }) => {
        if (error) console.log(error);
        if (!data.game) return null;
        const { game } = data;
        return (
          <div className='gotw-container'>
            <div className='gotw-header'>GameHub Game of the Week!</div>
            <div className='gotw-content'>
              <Link to={`/games/${game._id}`}>
                <div className='gotw-name'>{game.name}</div>
              </Link>
              <div className='gotw-console'>{game.gameConsole.name}</div>
              <img src={game.imageURL} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default GameOfTheWeek;
