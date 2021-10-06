import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let data;
  function fileChange(e) {
    console.log(e.target.files);
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (e) {
      data = e.target;
      console.log(data.result);
    };
    // 以DataURL的形式读取文件:
    reader.readAsText(e.target.files[0]);
  }
  return (
    <div className="App">
      <header className="App-header">
        <input type="file" id="input" onChange={fileChange} />
        <div>{data}</div>
      </header>
    </div>
  );
}

export default App;
