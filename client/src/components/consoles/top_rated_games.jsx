import React from 'react';
import { Link } from 'react-router-dom';

const TopRatedGames = ({ games }) => {
  return (
    <ul className='console-top-games-list'>
      {games.map((game, i) => {
        return (
          <Link to={`/games/${game._id}`} key={i}>
            <div className='console-top-games-item'>
              <div>{i + 1}</div>
              <div className='top-games-thumbnail'>
                <img src={game.imageURL} alt={`${game.name} image`} />
              </div>
              <div className='top-games-game-info'>
                <div>{game.name}</div>
                {game.console && (
                  <div className='list-console-name'>{`(${
                    game.console.name
                  })`}</div>
                )}
                <div className='game-rating'>
                  Rating: <span>{`${game.rating}%`}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

export default TopRatedGames;
