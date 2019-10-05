import { Server } from 'ws';
import {EventEmitter} from 'events';
import { Socket } from 'net';
export class WSServer extends EventEmitter{
    //strictPropertyInitialization:false
    _socket:Server;

    public listen(port:number):void{
        this._socket = new Server({port:port});
        //当有客户端连接时回调
        this._socket.on("connection",(socket,request)=>{
            console.log(request);
        });
    }
}