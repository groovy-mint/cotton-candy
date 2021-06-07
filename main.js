const { app, BrowserWindow, Menu } = require('electron');
const path = require("path");
var pathToApp=app.getAppPath().replace('app.asar','');

//Menu.setApplicationMenu(false);//프로그램 메뉴 삭제

function createWindow () {  // 브라우저 창을 생성
  let win = new BrowserWindow({
    width: 920,
    minWidth:920,
    minHeight: 680,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.$ = win.jQuery = require('./jquery.js');
  
  //브라우저창이 읽어 올 파일 위치
  win.loadFile('./pages/index.html');
}

app.on('ready', createWindow);

const sqlite3 = require('sqlite3').verbose();
//데이터베이스 관련된 초기 기능
let isConn = false;
let db = new sqlite3.Database(pathToApp+'cc.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the mydb database.');  
    isConn = true;
    db.run('CREATE TABLE IF NOT EXISTS seatList ( idx INTEGER PRIMARY KEY, title TEXT, male TEXT, female TEXT, date TEXT )',[], arg=>{
      console.log('create',arg);
    });
    db.run('CREATE TABLE IF NOT EXISTS seatLayout ( idx INTEGER PRIMARY KEY, bd INTEGER, column INTEGER, row INTEGER )',[], arg=>{
      console.log('create',arg);
    });
    db.run('CREATE TABLE IF NOT EXISTS personalSetting ( idx INTEGER PRIMARY KEY, optionName TEXT, optionValue TEXT)',[], arg=>{
      console.log('create',arg);
    });
    db.run('CREATE TABLE IF NOT EXISTS voteList ( idx INTEGER PRIMARY KEY, title TEXT, parts TEXT, numbers TEXT, memberNum INTEGER, votedNum INTEGER, partsNum INTEGER, date TEXT)',[], arg=>{
      console.log('create',arg);
    });
  }
});