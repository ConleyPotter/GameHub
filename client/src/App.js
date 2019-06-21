import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';

function App() {
  return (
    <div className='main-container'>
      <Route path='/' component={Navbar} />
    </div>
  );
}

export default App;
