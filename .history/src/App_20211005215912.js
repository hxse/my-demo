import React, { useDebugValue, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let [file, setFile] = React.useState("请输入文件");
  let [file2, setFile2] = React.useState("请输入文件");
  let [num, setNum] = React.useState(5);
  let [num2, setNum2] = React.useState(5);
  // let [color, setColor] = React.useState('');

  let [chapter, setChapter] = React.useState();
  let [config, setConfig] = React.useState();
  let [row, setRow] = React.useState();
  let [row2, setRow2] = React.useState();
  let [history, setHistory] = React.useState();
  let [data, setData] = React.useState();
  let [data2, setData2] = React.useState();

  useEffect(() => {
    async function getData() {
      let result = await fetch("http://127.0.0.1:8000/config/get/ATG");
      result = await result.json();
      console.log(result);
      setConfig(result);
      setChapter(result.currentChapters);
      setRow(Math.max(...result.currentRow[0]));
      setRow2(Math.max(...result.currentRow[1]));
      setHistory(result.history);
      console.log(result.currentRow,234234);

      let num = result.currentChapters;
      for (let language of ["chinese", "english"]) {
        result = await fetch(`http://127.0.0.1:8000/ATG/${language}/${num}`);
        result = await result.json();
        console.log(result);
        switch (language) {
          case "chinese":
            setFile(result);
            setRow((i) => {
              setData(result[i]);
              return i;
            });
            break;
          case "english":
            setFile2(result);
            setRow2((i) => {
              setData2(result[i]);
              return i;
            });
            break;
        }
      }
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
    let currentRow = [[row], [row2]];
    async function getData2(i) {
      let data = JSON.stringify(i);
      let api = `http://127.0.0.1:8000/config/update/ATG?config=${data}`;
      let result = await fetch(api);
      result = await result.json();
      console.log(1234, result);
    }

    function item0() {
      let _row = way ? row + 1 : row - 1;
      setRow(_row);
      setData(file[_row]);
      currentRow[0] = [_row];
      setConfig((i) => {
        i = { ...i, currentRow: currentRow };
        getData2(i);
        return i;
      });
    }
    function item1() {
      let _row2 = way ? row2 + 1 : row2 - 1;
      setRow2(_row2);
      setData2(file2[_row2]);
      currentRow[1] = [_row2];
      console.log(currentRow)
      setConfig((i, currentRow) => {
        i = { ...i, currentRow: currentRow };
        getData2(i);
        return i;
      });
    }
    switch (name) {
      case "all":
        item0();
        item1();
        break;
      case 0:
        item0();
        break;
      case 1:
        item1();
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
          第{chapter}章, {row}行, {row2}行, {history ? history[1][0][0][1] : undefined}
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
