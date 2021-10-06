import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let [data, setData] = React.useState("请输入文件");
  let [data2, setData2] = React.useState("请输入文件");

  function fileChange(e, v) {
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result.split("\n");
      switch (v) {
        case 0:
          setData(text[0]);
          break;
        case 1:
          setData2(text[0]);
          break;
      }
      console.log(e.target.result);
    };
    // 以DataURL的形式读取文件:
    reader.readAsText(e.target.files[0]);
  }
  function pageTurn(name, way) {}
  return (
    <div className="App">
      <header className="App-header">
        <input type="file" id="input" onChange={this.fileChange.bind(this, 0)} />
        <input type="file" id="input2" onChange={this.fileChange.bind(this, 1)} />
        <div id="reader">
          <div>{data}</div>
          <div>{data2}</div>
        </div>
        <div>
          <button id="up" onClick={this.pageTurn.bind(this, "all", 0)}>
            上
          </button>
          <button id="down" onClick={this.pageTurn.bind(this, "all", 1)}>
            下
          </button>
          <button id="up2" onClick={this.pageTurn.bind(this, 0, 0)}>
            上
          </button>
          <button id="down2" onClick={this.pageTurn.bind(this, 0, 1)}>
            下
          </button>
          <button id="upAll" onClick={this.pageTurn.bind(this, 1, 0)}>
            上
          </button>
          <button id="downAll" onClick={this.pageTurn.bind(this, 1, 1)}>
            下
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
