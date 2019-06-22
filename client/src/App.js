import React from 'react';
import logo from './logo.svg';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import ConsoleDetail from './components/consoles/console_detail';
import './App.scss';

function App() {
  return (
    <div className='main-container'>
      <Route path='/' component={Navbar} />
      <Switch>
        <Route path='/:consoleName' component={ConsoleDetail} />
      </Switch>
    </div>
  );
}

export default App;
