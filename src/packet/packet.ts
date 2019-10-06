let uuid4 = require('uuid/v4');
//数据包
export abstract class Packet{
    body:{};
    header:{};
}

export class Subscribe extends Packet{
    body:{
        eventName:string;
    };
    header:{
        requestId: string;
		messagePurpose: "subscribe";
		version: 1;
		messageType: "commandRequest";
    }

    constructor(eventName:string){
        super();
        this.body.eventName = eventName;
        this.header.requestId = uuid4();
    }
}

export class UnSubscribe extends Packet{
    body : {
		eventName: string;
    };
    
	header: {
		requestId: string,
		"messagePurpose": "unsubscribe",
		"version": 1,
		"messageType": "commandRequest"
    }
    
    constructor(eventName:string){
        super();
        this.body.eventName = eventName;
        this.header.requestId = uuid4();
    }
}