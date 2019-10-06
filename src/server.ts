import { Server } from 'ws';
import {EventEmitter} from 'events';
import { Socket } from 'net';
import {createInterface} from 'readline';
//创建一个负责输入输出的对象
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

//import {v4} from 'uuid';
let uuid4 = require('uuid/v4')
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
            let uuid = uuid4();
            let packet = {
                body:{
                    "eventName": "BlockPlaced"
                },
                header:{
                    requestId: uuid,
                    messagePurpose: "subscribe",
                    version: 1,
                    messageType: "commandRequest"
                }
            };
            socket.send(JSON.stringify(packet));



            //当socket收到信息时回调
            socket.on("message", message => {
                console.log("接收到信息");
                
                let data = JSON.parse(message as string);
                let msgPurpose = data.header.messagePurpose;
                if(msgPurpose == "error"){
                    console.log("Error recieved:", data);
                }
                else{
                    console.log(data.body.eventName);
                }
                
            });

            socket.on("error",err=>{
                console.log("建立的socket出现错误" + err.message);
            });

            socket.on("close", () => {console.log("客户端断开连接")});

            server.on("disconnect",()=>{
                console.log("断开连接");
                socket.close();
            });
        });

        this._socket.on("error",error=>{
            console.log(`出现错误${error}`);
        });


        //持续获得用户输入
        rl.on('line', (input) => {
            console.log(`接收到：${input}`);
            if(input == "断开连接"){
                server.emit("disconnect");
                
            }
        });

    }
}