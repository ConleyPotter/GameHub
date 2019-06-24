import React from 'react';

const TopRatedGames = ({ games }) => {
  return (
    <div className='console-top-games-container'>
      <div className='console-top-games-header'>Top Rated Games</div>
      <ul className='console-top-games-list'>
        {games.map((game, i) => {
          return (
            <div className='console-top-games-item'>
              <div>{i + 1}</div>
              <div className='top-games-thumbnail'>
                <img src={game.imageURL} alt={`${game.name} image`} />
              </div>
              <div className="top-games-game-info">
              <div>{game.name}</div>

              <div className='game-rating'>Rating: <span>{`${game.rating}%`}</span></div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default TopRatedGames;
