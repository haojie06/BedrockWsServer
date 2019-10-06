let uuid4 = require('uuid/v4');
//数据包
export abstract class Packet{
    body:{};
    header:{};
}

export class Subscribe extends Packet{
    body:{}
    header:{}

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
    body : {};
	header: {}
    
    constructor(eventName:string){
        super();
        this.body = {
            eventName: eventName
        };

        this.header = {
            requestId: uuid4,
            messagePurpose: "unsubscribe",
            version: 1,
            messageType: "commandRequest"
        }
    }
}