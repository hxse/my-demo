import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  document.getElementById("input").addEventListener("change",function () {
        console.log("change");
    });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="file" id="input">

      </header>
    </div>
  );
}

export default App;
