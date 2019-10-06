import { Server } from 'ws';
import {EventEmitter} from 'events';
import { Socket } from 'net';
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
            //当socket收到信息时回调
            socket.on("message", message => {
                console.log("接收到信息");
                /*
                console.log(socket.url);
                let data = JSON.parse(message as string);
                let msgPurpose = data.header.messagePurpose;
                if(msgPurpose == "error"){
                    console.log("Error recieved:", data);
                }
                else{
                    console.log(data.body.eventName);
                }
                */
            });

            //socket.on("close", () => {console.log("客户端断开连接")});
        });
    }
}