import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function fileChange(e) {
    console.log(e.target.files);
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (e) {
      let data = e.target.result; // 'data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...'
      preview.style.backgroundImage = "url(" + data + ")";
    };
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(e.target.file);
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
