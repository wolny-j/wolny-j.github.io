import Header from './Components/Header';
import GameContent from './Components/GameContent';
import Footer from './Components/Footer';

import './CSS/App.css'

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
