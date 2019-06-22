import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import ConsoleDetail from './components/consoles/console_detail';
import GameDetail from './components/games/GameDetail';
import './App.scss';

function App() {
	return (
		<div className="main-container">
			<Route path="/" component={Navbar} />
			<Switch>
				<Route path="/:consoleName" component={ConsoleDetail} />
				<Route path="/games/:gameId" component={GameDetail} />
			</Switch>
		</div>
	);
}

export default App;
