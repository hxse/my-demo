import React, { useDebugValue } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dexie from "dexie";

//数据库
const db = new Dexie("FriendDatabase");
db.version(1).stores({
  friends: "++id,name,age",
});
const englishDb = new Dexie("textDb");
englishDb.version(1).stores({
  text: "++id,text",
});
const chineseDb = new Dexie("textDb");
chineseDb.version(1).stores({
  text: "++id,text",
});

// db.friends
//   .add({ name: "Josephine", age: 21 })
//   .then(function () {
//     return db.friends.where("age").below(25).toArray();
//   })
//   .then(function (youngFriends) {
//     alert("My young friends: " + JSON.stringify(youngFriends));
//   })
//   .catch(function (e) {
//     alert("Error: " + (e.stack || e));
//   });

console.log(englishDb.text, chineseDb);
function addData() {}
async function addFileDb(name, text) {
  for (let i of text) {
    switch (name) {
      case 0:
        await englishDb.add({ text: i });
        break;
      case 1:
        await chineseDb.add({ text: i });
        break;
    }
  }
}
function App() {
  let [file, setFile] = React.useState("请输入文件");
  let [file2, setFile2] = React.useState("请输入文件");
  let [data, setData] = React.useState("请输入文件");
  let [data2, setData2] = React.useState("请输入文件");
  let [num, setNum] = React.useState(5);
  let [num2, setNum2] = React.useState(5);
  // let [color, setColor] = React.useState('');

  function fileChange(v, event) {
    // 读取文件:
    let reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result.split("\n");
      switch (v) {
        case 0:
          setFile(text);
          // setData(text[0]);
          addFileDb("english", text);
          break;
        case 1:
          setFile2(text);
          // setData2(text[0]);
          addFileDb("chinese", text);
          break;
      }
      console.log(db);
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
        {/* <div>{friends}</div> */}
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
