import React, { useDebugValue, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let [file, setFile] = React.useState("请输入文件");
  let [file2, setFile2] = React.useState("请输入文件");
  let [data, setData] = React.useState("请输入文件");
  let [data2, setData2] = React.useState("请输入文件");
  let [num, setNum] = React.useState(5);
  let [num2, setNum2] = React.useState(5);
  // let [color, setColor] = React.useState('');

  let [chapter, setChapter] = React.useState();
  let [row, setRow] = React.useState();
  let [row2, setRow2] = React.useState();
  let [history, setHistory] = React.useState();

  useEffect(() => {
    async function getData() {
      let result = await fetch("http://127.0.0.1:8000/config/get/ATG");
      result = await result.json();
      console.log(result);
      setChapter(result.currentChapters);
      setRow(Math.max(...result.currentRow[0]));
      setRow2(Math.max(...result.currentRow[1]));
      setHistory(result.history);
      console.log(result.history);

      let language = "chinese";
      let num = result.currentChapters;
      console.log(1234214);
       result = await fetch(`http://127.0.0.1:8000/ATG/${language}/${num}`);
      result = await result.json();
      console.log(result);
    }
    getData();
  }, []);

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
    function up() {
      setNum(way ? num + 1 : num - 1);
      setNum((state) => {
        setData(file[state]);
        return state;
      });
    }
    function down() {
      setNum2(way ? num2 + 1 : num2 - 1);
      setNum2((state) => {
        setData2(file2[state]);
        return state;
      });
    }
    switch (name) {
      case "all":
        up();
        down();
        break;
      case 0:
        up();
        break;
      case 1:
        down();
        break;
    }
  }
  return (
    <div className="App">
      <div className="container">
        <div className="file">
          <input type="file" id="input" onChange={fileChange.bind(this, 0)} />
          <input type="file" id="input2" onChange={fileChange.bind(this, 1)} />
        </div>
        <div>
          {chapter},{row},{row2},{history ? history[1][0][0][1] : undefined}
        </div>
        <div id="reader" className="content">
          <div>{data}</div>
          <div>{data2}</div>
        </div>
        <div className="footer">
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
      </div>
    </div>
  );
}

export default App;
