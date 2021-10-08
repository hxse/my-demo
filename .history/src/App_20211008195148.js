import React, { useEffect } from "react";
import "./App.css";
import { use100vh } from "react-div-100vh";
import { assert } from "workbox-core/_private";

const keyBinds = [
  [0, "#content1HrDown"], //A
  [1, "#content1HrUp"], //B
  [2, "#content2HrDown"], //X
  [3, "#content2HrUp"], //Y
  [4, "#upAll"], //R
  [5, "#downAll"], //L
];

const axesBinds = [
  //不要动顺序,只能动id, 参考id "#translateHrDown" "#chapterDown"
  [0, 1, "#down"], //right
  [1, 1, "#down2"], //down
  [0, -1, "#up"], //left
  [1, -1, "#up2"], //up
];

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
let _axes = [false, false, false, false];
let _axesLR;
let bingji;
setInterval(() => {
  if (gamepadIndex !== undefined) {
    const myGamepad = navigator.getGamepads()[gamepadIndex];
    const pressNum = myGamepad.axes.filter((item) => item == 1 || item == -1).length;

    if (pressNum == 1) {
      myGamepad.axes.forEach((item, buttonIndex) => {
        for (let [idx, value, id] of axesBinds) {
          if (idx == buttonIndex && value == item) {
            let _idx = item == -1 ? idx + 2 : idx;
            if (_axes[_idx] == false) {
              _axes[_idx] = true;
              document.querySelector(id).click();
            }
          }
        }
      });
    }

    if (pressNum == 0) {
      if (_axes.filter((i) => i == true).length > 0) {
        for (let i in _axes) {
          _axes[i] = false;
        }
      }
    }

    myGamepad.buttons.forEach((item, buttonIndex) => {
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

function App() {
  let [contentHeightState, setContentHeightState] = React.useState();
  function cleanLine(id) {
    let contentDiv = document.querySelector(id);
    for (let span of contentDiv.querySelectorAll("span")) {
      span.style.textDecoration = "";
    }
  }
  function getRows(spans) {
    //把span按行分类
    return spans.reduce(function (pre, current, index) {
      // console.log(index, span.offsetTop);
      if (index == 0) {
        return [[current]];
      }
      if (current.data.offsetTop == pre[pre.length - 1][pre[pre.length - 1].length - 1].data.offsetTop) {
        pre[pre.length - 1].push(current);
        return pre;
      } else {
        return [...pre, [current]];
      }
    }, []);
  }
  function contentPage(id, way) {
    let spanArr = [];
    let contentDiv = document.querySelector(id);
    let contentTop = contentDiv.getBoundingClientRect().top;
    let contentBottom = contentDiv.getBoundingClientRect().bottom;
    for (let span of contentDiv.querySelectorAll("span")) {
      let spanTop = span.getBoundingClientRect().top;
      let spanBottom = span.getBoundingClientRect().bottom;
      if (spanTop < contentTop && spanBottom < contentTop) {
        //上方
        spanArr.push({ name: "up", data: span, idx: spanArr.length });
      }
      if (spanTop < contentTop && spanBottom > contentTop) {
        //上方临界
        spanArr.push({ name: "_up", data: span, idx: spanArr.length });
      }
      if (spanTop >= contentTop && spanBottom <= contentBottom) {
        //正文
        spanArr.push({ name: "content", data: span, idx: spanArr.length });
        console.log("正文", spanTop, spanBottom, contentBottom);
      }
      if (spanTop < contentBottom && spanBottom > contentBottom) {
        //下方临界
        spanArr.push({ name: "_down", data: span, idx: spanArr.length });
        console.log("下方临界", spanTop, spanBottom, contentBottom);
      }
      if (spanTop > contentBottom && spanBottom > contentBottom) {
        //下方
        spanArr.push({ name: "down", data: span, idx: spanArr.length });
      }

      let lapse = 1; //尾行可能会有一像素的误差,所以用1而不是0
      if (spanArr[spanArr.length-1].name == "content" && spanBottom - contentBottom <= 1) {
        console.log("捕捉误差 content", span);
      }
      if (spanArr[spanArr.length-1].name == "_down" && spanBottom - contentBottom > 1) {
        console.log("捕捉误差 _down", span);
      }
    }
    // console.log(_spanUp, _spanDown, spanContentStart, spanContentEnd);
    // console.log(spanArr);
    console.assert(spanArr.length == contentDiv.querySelectorAll("span").length);

    cleanLine(id);
    let contentSpan = spanArr.filter((i) => i.name == "content");
    let contentRows = getRows(contentSpan);
    let spanContentStartRow = contentRows[0];
    let spanContentEndRow = contentRows[contentRows.length - 1];
    let spanContentStart = spanContentStartRow[0];
    let spanContentEnd = spanContentEndRow[spanContentEndRow.length - 1];
    if (way == "down") {
      contentDiv.scrollTop = contentDiv.scrollTop + (spanContentEnd.data.getBoundingClientRect().top - contentTop);
      spanContentEndRow.forEach((i) => {
        let span = i.data;
        span.style.textDecoration = "underline";
        span.style.textDecorationThickness = "0.02em";
        span.style.textDecorationStyle = "solid";
      });
      if (spanContentEnd.idx == spanArr.length - 2) {
        //最后一行
        // console.log(spanContentEnd,);
      }
    } else {
      contentDiv.scrollTop =
        contentDiv.scrollTop - (contentBottom - spanContentStart.data.getBoundingClientRect().bottom);
      spanContentStartRow.forEach((i) => {
        let span = i.data;
        span.style.textDecoration = "underline";
        span.style.textDecorationThickness = "0.02em";
        span.style.textDecorationStyle = "dashed";
      });
    }
  }

  let [translate, setTranslate] = React.useState();
  let [translate2, setTranslate2] = React.useState();
  function trans2str(json) {
    return json
      ? Object.keys(json)
          .map((i) => `${i}:${json[i]}`)
          .join("\n")
      : null;
  }
  async function mouseEnterEvent(event, text) {
    let word = event.i.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()…]/g, "");

    let dataArr = [];
    for (let stem of [false, true]) {
      const response = await fetch(`http://127.0.0.1:8000/dict/${word}?stem=${stem}`);
      const json = await response.json();
      let data = json ? { word: json.word, phonetic: json.phonetic, translate: json.translation } : {};
      dataArr.push(data);
    }
    if (dataArr[1].word == dataArr[0].word) {
      dataArr[1] = null;
    }
    setTranslate(dataArr[0]);
    setTranslate2(dataArr[1]);
  }

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
            document.querySelector("#content1").scrollTop = 0;
            cleanLine("#content1");
            return i;
          });
          break;
        case "english":
          setFile2(result);
          setRow2((i) => {
            setData2(result[i]);
            document.querySelector("#content1").scrollTop = 0;
            cleanLine("#content1");
            return i;
          });
          break;
      }
    }
  }
  useEffect(() => {
    getData();
    document.querySelector("div.container").height -= 1;
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
      document.querySelector("#content2").scrollTop = 0;
      cleanLine("#content2");
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
      document.querySelector("#content1").scrollTop = 0;
      cleanLine("#content1");
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
  return (
    <div className="App">
      <div className="container" style={{ height: use100vh() * 0.95 }}>
        <div className="file">
          <input type="file" id="input" onChange={fileChange.bind(this, 0)} />
          <input type="file" id="input2" onChange={fileChange.bind(this, 1)} />
        </div>
        <div>
          第{chapter}章, {row}行, {row2}行, {history ? history[1][0][0][1] : undefined},版本1.1
          <hr className="hr-edge-weak" />
        </div>
        <div id="reader" className="content">
          <div id="content1">
            {data2
              ? data2.split(" ").map((i) => <span onMouseEnter={mouseEnterEvent.bind(this, { i })}>{i} </span>)
              : undefined}
          </div>
          <div className="hr-wrapper">
            <hr id="content1HrUp" className="hr-twill" onClick={contentPage.bind(this, "#content1", "up")} />
            <hr id="content1HrDown" className="hr-twill" onClick={contentPage.bind(this, "#content1", "down")} />
          </div>
          <div id="content2"> {data ? data.split("").map((i) => <span>{i}</span>) : undefined}</div>
          <div className="hr-wrapper">
            <hr id="content2HrUp" className="hr-twill" onClick={contentPage.bind(this, "#content2", "up")} />
            <hr id="content2HrDown" className="hr-twill" onClick={contentPage.bind(this, "#content2", "down")} />
          </div>
          <div id="translate">
            <div>{trans2str(translate)}</div>
            <div>{trans2str(translate2)}</div>
          </div>
          <div className="hr-wrapper">
            <hr id="translateHrUp" className="hr-twill" onClick={contentPage.bind(this, "#translate", "up")} />
            <hr id="translateHrDown" className="hr-twill" onClick={contentPage.bind(this, "#translate", "down")} />
          </div>
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
      </div>
    </div>
  );
}

export default App;
