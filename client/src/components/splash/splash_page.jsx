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
          <TrendingGames />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
