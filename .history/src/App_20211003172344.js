import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function fileChange(e) {
    console.log(e.target.files);
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (e) {
      let data = e.target.result;
      console.log(data);
    };
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(e.target.files[0]);
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
