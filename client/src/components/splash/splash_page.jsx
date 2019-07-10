import React from 'react';
import './splash_page.scss';
import SplashTopGames from './splash_page_top_games';
import TrendingGames from './trending_games';
import RecentNews from './recent_news';
import GameOfTheWeek from './game-of-the-week';

const SplashPage = () => {
	return (
		<div className="splash-page-main-container">
			<div className="splash-hero-image">
				<img src="https://images.unsplash.com/photo-1527690789675-4ea7d8da4fe3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1283&q=80" />
			</div>
			<div className="splash-page-content">
				<div className="splash-page-lists">
					<SplashTopGames />
					<div className="splash-pixel-image">
						<img src="https://image.flaticon.com/sprites/new_packs/188915-pokemon-go.png" />
					</div>
					<div className="splash-page-right">
						<TrendingGames />
						<GameOfTheWeek />
					</div>
				</div>
				<RecentNews />
			</div>
		</div>
	);
};

export default SplashPage;
