import React from 'react';
import './splash_page.scss';
import SplashTopGames from './splash_page_top_games';
import TrendingGames from './trending_games';

const SplashPage = () => {
  return (
    <div className='splash-page-main-container'>
      <div className='splash-hero-image'>
        <img src='https://images.unsplash.com/photo-1527690789675-4ea7d8da4fe3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1283&q=80' />
      </div>
      <div className='splash-page-content'>
        <div className='splash-page-lists'>
          <SplashTopGames />
          <div className='splash-pixel-image'>
            <img src='https://png2.kisspng.com/sh/a2575926c75ea708ad16a9967040a858/L0KzQYm3V8A3N6NwgZH0aYP2gLBuTgNxaZRqRdt3dnHndcP6TgBqgJZxRdN7dD35ebXsj71oaZ5qRdN9YYLsPYm3k71iepRmfNc2Z3HwdcS0VfI1OGE3fqMDOETmdYe1UME0OGI5UKU6NUOzSYO4V8E0PWY9S5D5bne=/kisspng-space-invaders-pixel-art-video-game-atari-80s-arcade-games-5b4002f1884ce6.0130148315309217135583.png' />
          </div>
          <TrendingGames />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
