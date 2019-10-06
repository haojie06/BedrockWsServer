import { Server } from 'ws';
import {EventEmitter} from 'events';
import { Socket } from 'net';
export class WSServer extends EventEmitter{
    //strictPropertyInitialization:false
    _socket:Server;

    public listen(port:number):void{
        this._socket = new Server({port:port});
        //当有客户端连接时回调
        console.log("WS开始监听" + port);
        this._socket.on("connection",(socket,request)=>{
            console.log("客户端连接");
        
            //当socket收到信息时回调
            socket.on("message", function(message) {
                console.log(message);
                socket.send("已收到",(err)=>{
                    if(err){
                        console.log("返回信息出错");
                    }
                });
                let data = JSON.parse(message as string);
                let msgPurpose = data.header.messagePurpose;
                if(msgPurpose == "error"){
                    console.log("Error recieved:", data);
                }
                else{
                    console.log(data.body.eventName);
                }
            });

            socket.on("close", () => {console.log("客户端断开连接")});
        
        });
    }
}