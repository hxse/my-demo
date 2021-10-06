import React, { useEffect } from "react";
import "./App.css";
import Div100vh from "react-div-100vh";

let gamepadIndex;
window.addEventListener("gamepadconnected", function (e) {
  let gp = navigator.getGamepads()[e.gamepad.index];
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gp.index,
    gp.id,
    gp.buttons.length,
    gp.axes.length
  );
  gamepadIndex = e.gamepad.index;
});

let buttons = [false, false, false, false, false, false];
setInterval(() => {
  if (gamepadIndex !== undefined) {
    const myGamepad = navigator.getGamepads()[gamepadIndex];
    myGamepad.buttons.forEach((item, buttonIndex) => {
      let keyBinds = [
        [0, "#up"], //A
        [1, "#down"], //B
        [2, "#up2"], //X
        [3, "#down2"], //Y
        [4, "#upAll"], //R
        [5, "#downAll"], //L
      ];
      for (let [idx, id] of keyBinds) {
        if (buttonIndex == idx) {
          if (item.pressed) {
            if (buttons[idx] == false) {
              document.querySelector(id).click();
            }
            buttons[idx] = true;
          } else {
            buttons[idx] = false;
          }
        }
      }
    });
  }
}, 100);

function addMutationObserver() {
  // for (let id of ["#content1", "#content2"]) {
  //   let observer = new MutationObserver(function (mutations, observer) {
  //     mutations.forEach(function (mutation) {
  //       console.log('监听:',mutation,observer,);
  //     });
  //   });
  //   let article = document.querySelector(id);
  //   let options = {
  //     childList: true,
  //     characterData: true,
  //   };
  //   observer.observe(article, options);
  // }
}

function mountDict(text) {
  let content1 = document.querySelector("#content1");
  // content1.textContent=text
  // let textArr = text.split(' ')
  // for (let word of textArr) {
  //   let wordSpan = <span>{word}</span>
  //   content1.appendChild(wordSpan)
  // }
}
function App() {
  let [key, setKey] = React.useState();
  document.addEventListener("keydown", (e) => {
    // console.log("按下按键", e);
  });

  // let [button, setButton] = React.useState();

  let [file, setFile] = React.useState("请输入文件");
  let [file2, setFile2] = React.useState("请输入文件");
  // let [color, setColor] = React.useState('');

  let [chapter, setChapter] = React.useState();
  let [config, setConfig] = React.useState();
  let [row, setRow] = React.useState();
  let [row2, setRow2] = React.useState();
  let [history, setHistory] = React.useState();
  let [data, setData] = React.useState();
  let [data2, setData2] = React.useState();

  async function getData() {
    let result = await fetch("http://127.0.0.1:8000/config/get/ATG");
    result = await result.json();
    // console.log(result);
    setConfig(result);
    setChapter(result.currentChapters);
    setRow(Math.max(...result.currentRow[0]));
    setRow2(Math.max(...result.currentRow[1]));
    setHistory(result.history);

    let num = result.currentChapters;
    for (let language of ["chinese", "english"]) {
      result = await fetch(`http://127.0.0.1:8000/ATG/${language}/${num}`);
      result = await result.json();
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
            mountDict(result[i]);
            return i;
          });
          break;
      }
    }
  }
  useEffect(() => {
    getData();
    addMutationObserver();
    console.log("初始化运行");
  }, []);

  function fileChange(v, event) {
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result.split("\n");
      switch (v) {
        case 0:
          setFile(text);
          break;
        case 1:
          setFile2(text);
          break;
      }
    };
    reader.readAsText(event.target.files[0]);
  }
  function pageTurn(name, way, event) {
    let currentRow = [[row], [row2]];
    async function updateData(i, refresh) {
      let data = JSON.stringify(i);
      let api = `http://127.0.0.1:8000/config/update/ATG?config=${data}`;
      let result = await fetch(api);
      result = await result.json();
      if (refresh) {
        getData();
      }
    }

    function item0() {
      let _row = way ? row + 1 : row - 1;
      setRow(_row);
      setData(file[_row]);
      if (_row >= file.length) {
        return "over";
      }
      if (_row < 0) {
        return "pass";
      }
      currentRow[0] = [_row];
      setConfig((i) => {
        i = { ...i, currentRow: currentRow };
        updateData(i);
        return i;
      });
    }
    function item1() {
      let _row2 = way ? row2 + 1 : row2 - 1;
      setRow2(_row2);
      setData2(file2[_row2]);
      mountDict(file2[_row2])
      if (_row2 >= file2.length) {
        return "over";
      }
      if (_row2 < 0) {
        return "pass";
      }
      currentRow[1] = [_row2];
      setConfig((i2) => {
        i2 = { ...i2, currentRow: currentRow };
        updateData(i2);
        return i2;
      });
    }
    function chapter(mode) {
      setConfig((i) => {
        let currentChapters = mode == "up" ? i.currentChapters - 1 : i.currentChapters + 1;
        i = { ...i, currentChapters: currentChapters, currentRow: [[0], [0]] };
        updateData(i, true);
        return i;
      });
    }
    switch (name) {
      case "all":
        let res0 = item0();
        let res1 = item1();
        if (res0 == "pass" && res1 == "pass") {
          chapter("up");
        }
        if (res0 == "over" && res1 == "over") {
          chapter("down");
        }
        break;
      case 0:
        item0();
        break;
      case 1:
        item1();
        break;
      case "chapterUp":
        chapter("up");
        break;
      case "chapterDown":
        chapter("down");
        break;
    }
  }
  let hr = <hr className="hr-twill" />;
  return (
    <div className="App">
      <Div100vh className="container">
        <div className="file">
          <input type="file" id="input" onChange={fileChange.bind(this, 0)} />
          <input type="file" id="input2" onChange={fileChange.bind(this, 1)} />
        </div>
        <div>
          第{chapter}章, {row}行, {row2}行, {history ? history[1][0][0][1] : undefined}
          <hr className="hr-edge-weak" />
        </div>
        <div id="reader" className="content">
          <div id="content1" >
            {data}
            {hr}
          </div>
          <div id="content2" >
            {data}
            {hr}
          </div>
          <div id="translate">It is a dict.</div>
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
          <button id="chapterUp" onClick={pageTurn.bind(this, "chapterUp", 0)}>
            上章
          </button>
          <button id="chapterDown" onClick={pageTurn.bind(this, "chapterDown", 1)}>
            下章
          </button>
        </div>
      </Div100vh>
    </div>
  );
}

export default App;
