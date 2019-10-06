let uuid4 = require('uuid/v4');
//数据包
export abstract class Packet{
    body:{};
    header:{};
}

export class Subscribe extends Packet{
    body:{
        eventName: string;
    };
    header:{
        requestId: string;
        messagePurpose: string;
        version: number;
        messageType: string;
    };

    constructor(eventName:string){
        super();
        this.body = {
            eventName:eventName
        };

        this.header = {
            requestId: uuid4(),
            messagePurpose: "subscribe",
            version: 1,
            messageType: "commandRequest"
        };
    }
}

export class UnSubscribe extends Packet{
    body:{
        eventName: string;
    };
    header:{
        requestId: string;
        messagePurpose: string;
        version: number;
        messageType: string;
    }
    
    constructor(eventName:string,uuid = uuid4()){
        super();


        this.body = {
            eventName: eventName
        };

        this.header = {
            requestId: uuid,
            messagePurpose: "unsubscribe",
            version: 1,
            messageType: "commandRequest"
        }

    }
}

export class CommandPacket extends Packet{
    body:{};
    header:{};

    constructor(cmd:string){
        super();
        this.body = {
            origin: 
            {
                type: "player"
            },
            commandLine: cmd,
            version: 1
        };

        this.header = {
            requestId: uuid4,
            messagePurpose: "commandRequest",
            version: 1,
            messageType: "commandRequest"
        };
    }
}