import React from 'react';
import './App.css';
import PingPong from './Components/PingPong/PinPong'
import Cube from './Components/PingPong/Cube'
import Title from './Components/Header/Title'

function App() {
  return (
    <div className="App">
      <main className="App-header">
        <Title />
        <PingPong />
        <Cube />
      </main>
    </div>
  );
}

export default App;
