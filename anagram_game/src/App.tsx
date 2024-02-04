import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import GameContent from './Components/GameContent';
import './CSS/mainPage.css'
import Footer from './Components/Footer';

function App() {
  return (
    <div className="page">
      <Header/>
      <GameContent/>
      <Footer/>
    </div>
  );
}

export default App;
