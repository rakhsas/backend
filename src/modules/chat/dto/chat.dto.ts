export class CreateChatDto {
    id?:number;
    sender_id: string;
    receiver_id: string;
    type: string;
    message: string;
    media_url?: string;
    constructor(body: any) {
        this.sender_id = body.sender_id;
        this.receiver_id = body.receiver_id;
        this.type = body.type;
        this.message = body.message;
        this.media_url = body.media_url;
    }
}


export class UpdateChatDto {
    sender_id: string ;
    receiver_id: string  ;
    type: string;
    message: string;
    media_url?: string;
    constructor(body: any) {
        this.sender_id = body.sender_id;
        this.receiver_id = body.receiver_id;
        this.type = body.type;
        this.message = body.message;
        this.media_url = body.media_url;
    }
}