"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const events_1 = require("events");
class WSServer extends events_1.EventEmitter {
    listen(port) {
        this._socket = new ws_1.Server({ port: port });
        //当有客户端连接时回调
        console.log("WS开始监听" + port);
        this._socket.on("connection", (socket, request) => {
            console.log("客户端连接");
            //当socket收到信息时回调
            socket.on("message", function (message) {
                let data = JSON.parse(message);
                let msgPurpose = data.header.messagePurpose;
                if (msgPurpose == "error") {
                    console.log("Error recieved:", data);
                }
                else {
                    console.log(data.body.eventName);
                }
            });
            socket.on("close", () => { console.log("客户端断开连接"); });
        });
    }
}
exports.WSServer = WSServer;
