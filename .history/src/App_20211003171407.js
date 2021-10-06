import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function fileChange(e) {
    console.log(123)
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="file" id="input" onChange={fileChange} />
      </header>
    </div>
  );
}

export default App;
