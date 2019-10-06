import { Packet,UnSubscribe,Subscribe,CommandPacket } from './packet/packet';
import { Server } from 'ws';
import {EventEmitter} from 'events';
import { Socket } from 'net';
import {createInterface} from 'readline';
//import {v4} from 'uuid';
let uuid4 = require('uuid/v4');
//创建一个负责输入输出的对象
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});


export class WSServer extends EventEmitter{
    //strictPropertyInitialization:false
    _socket:Server;

    public listen(port:number):void{
        let server:WSServer = this;

        this._socket = new Server({port:port});
        //当有客户端连接时回调
        console.log("WS开始监听" + port);
        this._socket.on("connection",socket => {
            console.log("客户端连接");
            
            //发送subscribe包建立监听
            registerSubscribe(socket,"PlayerMessage");
            registerSubscribe(socket,"BlockPlaced");

            //当socket收到信息时回调
            socket.on("message", message => {
                console.log("接收到客户端的信息");
                
                let data = JSON.parse(message as string);
                let msgPurpose = data.header.messagePurpose;
                if(msgPurpose == "error"){
                    console.log("出现错误:", data);
                }
                else if(msgPurpose == "event"){
                    console.log(data.body.eventName);
                    //发送unsubscribe包，取消对该事件的监听，具体表现为服务端只能获得一次客户端的方块放置事件
                    if (data.body.eventName == "BlockPlaced"){
                        sendCommand(socket,`say 发送unsubscribe包解除对方块放置事件的监听`);
                        unRegisterSubscribe(socket,"BlockPlaced");
                    }

                }
                else if(msgPurpose == "commandResponse"){
                    console.log("命令返回：" + data.body.statusCode);
                }
                
            });
            //接收到控制台的发送信息事件
            server.on("sendMsg",msg=>{
                console.log("[sendMsg]:" + msg);
                sendCommand(socket,`say ${msg}`);
            });

            socket.on("error",err=>{
                console.log("建立的socket出现错误" + err.message);
            });

            socket.on("close", () => {console.log("客户端断开连接")});

        });

        this._socket.on("error",error=>{
            console.log(`出现错误${error}`);
        });


        //持续获得用户输入
        rl.on('line', (input) => {
            console.log(`[consoleInput]：${input}`);
            let [cmd,content] = input.split(":");
            if(cmd == "send"){
                //触发sendMsg事件
                server.emit("sendMsg",content);
            }
            else if(cmd == "exit"){
                process.exit();
            }
        });

    }
}

function registerSubscribe(socket:any,eventName:string):void{
    let packet:Subscribe = new Subscribe(eventName);
    socket.send(JSON.stringify(packet));
}

function unRegisterSubscribe(socket:any,eventName:string):void{
    let packet:UnSubscribe = new UnSubscribe(eventName);
    socket.send(JSON.stringify(packet));
}

function sendCommand(socket:any,command:string):void{
    let packet:CommandPacket = new CommandPacket(command);
    socket.send(JSON.stringify(packet));
}