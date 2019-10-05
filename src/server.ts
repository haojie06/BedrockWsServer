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
        
            socket.on("message", function(message) {
                let data = JSON.parse(message as string);

                switch(data.header.messagePurpose){
                    case "error":
                        console.log("Error recieved:", data);
                        break;

                    case "event":
                        //if(server.eventNames().indexOf(data.body.eventName) === -1) return;
                        console.log(data.body.eventName);
                        break;
                }
            });
        
        });
    }
}