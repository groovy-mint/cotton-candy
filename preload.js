const { contextBridge } = require("electron");
var sqlite3 = require('sqlite3').verbose();

contextBridge.exposeInMainWorld(
    "api", {
        request : (channel, data) => {
            console.log(channel, data);//html에서 넘기는 값, channel로 구분하면 된다.
            data.calback({result:'성공'});
        }
    }
);