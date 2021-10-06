import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let [file, setFile] = React.useState("请输入文件");
  let [file2, setFile2] = React.useState("请输入文件");
  let [data, setData] = React.useState("请输入文件");
  let [data2, setData2] = React.useState("请输入文件");
  let [num, setNum] = React.useState(5);

  function fileChange(v, event) {
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result.split("\n");
      switch (v) {
        case 0:
          setFile(text);
          // setData(text[0]);
          break;
        case 1:
          setFile2(text);
          // setData2(text[0]);
          break;
      }
    };
    reader.readAsText(event.target.files[0]);
  }
  function pageTurn(name, way, event) {
    // console.log(num);

    switch (name) {
      case "all":
        break;
      case 0:
        setNum(way ? num + 1 : num - 1);
        setData(file[num]);
        setNum((state) => state);
        console.log(num);
        break;
      case 1:
        break;
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <input type="file" id="input" onChange={fileChange.bind(this, 0)} />
        <input type="file" id="input2" onChange={fileChange.bind(this, 1)} />
        <div id="reader">
          <div>{data}</div>
          <div>{data2}</div>
        </div>
        <div>
          <button id="up" onClick={pageTurn.bind(this, 0, 0)}>
            上0
          </button>
          <button id="down" onClick={pageTurn.bind(this, 0, 1)}>
            下0
          </button>
          <button id="up2" onClick={pageTurn.bind(this, 1, 0)}>
            上1
          </button>
          <button id="down2" onClick={pageTurn.bind(this, 1, 1)}>
            下1
          </button>
          <button id="upAll" onClick={pageTurn.bind(this, "all", 0)}>
            上全
          </button>
          <button id="downAll" onClick={pageTurn.bind(this, "all", 1)}>
            下全
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
