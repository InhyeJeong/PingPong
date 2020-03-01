import React from 'react';
import './App.css';
import PingPong from './Components/PingPong/PinPong'
import Title from './Components/Header/Title'

function App() {
  return (
    <div className="App">
      <main className="App-header">
        <Title />
        <PingPong />
      </main>
    </div>
  );
}

export default App;
