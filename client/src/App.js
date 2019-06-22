import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import GameDetail from './components/games/GameDetail';

function App() {
	return (
		<div className="main-container">
			<Route path="/" component={Navbar} />
			<Route path="/games/:gameId" component={GameDetail} />
		</div>
	);
}

export default App;
