"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packet_1 = require("./packet/packet");
const ws_1 = require("ws");
const events_1 = require("events");
const readline_1 = require("readline");
//import {v4} from 'uuid';
let uuid4 = require('uuid/v4');
//创建一个负责输入输出的对象
const rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout
});
class WSServer extends events_1.EventEmitter {
    listen(port) {
        let server = this;
        this._socket = new ws_1.Server({ port: port });
        //当有客户端连接时回调
        console.log("WS开始监听" + port);
        this._socket.on("connection", socket => {
            console.log("客户端连接");
            //发送subscribe包建立监听
            let packet = new packet_1.Subscribe("BlockBroken");
            socket.send(JSON.stringify(packet));
            //当socket收到信息时回调
            socket.on("message", message => {
                console.log("接收到信息");
                let data = JSON.parse(message);
                let msgPurpose = data.header.messagePurpose;
                if (msgPurpose == "error") {
                    console.log("出现错误:", data);
                }
                else {
                    console.log(data.body.eventName);
                    console.log(data.body.properties.Block);
                    //测试unsubscribe,解除对破坏事件的监听 ?难道需要相同的requestid？不需要
                    let usPacket = new packet_1.UnSubscribe("BlockBroken");
                    socket.send(JSON.stringify(packet));
                }
            });
            //接收到控制台的发送信息事件
            server.on("sendMsg", msg => {
                let packet = new packet_1.CommandPacket('say ' + msg);
                console.log("发送信息");
                socket.send(packet);
            });
            socket.on("error", err => {
                console.log("建立的socket出现错误" + err.message);
            });
            socket.on("close", () => { console.log("客户端断开连接"); });
        });
        this._socket.on("error", error => {
            console.log(`出现错误${error}`);
        });
        //持续获得用户输入
        rl.on('line', (input) => {
            console.log(`接收到：${input}`);
            let [cmd, content] = input.split(":");
            console.log(cmd + ":" + content);
            if (cmd == "send") {
                server.emit("sendMsg", content);
            }
        });
    }
}
exports.WSServer = WSServer;
