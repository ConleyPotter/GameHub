import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import ConsoleDetail from './components/consoles/console_detail';
import GameDetail from './components/games/GameDetail';
import SplashPage from './components/splash/splash_page';
import './App.scss';

function App() {
  return (
    <div className='main-container'>
      <Route path='/' component={Navbar} />
      <Switch>
        <Route exact path='/' component={SplashPage} />
        <Route exact path='/games/:gameId' component={GameDetail} />
        <Route path='/:consoleName' component={ConsoleDetail} />
      </Switch>
    </div>
  );
}

export default App;
