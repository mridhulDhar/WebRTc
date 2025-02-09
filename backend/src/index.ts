import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", function connection(ws){
    ws.on("error", console.error);

    ws.on("message", function message(data: any){
        const message = JSON.parse(data);
        if(message.type === "sender"){
            console.log("---sender---");
            senderSocket = ws;
        }
        else if(message.type === "receiver"){
            console.log("---receiver---");
            receiverSocket = ws;
        }
        else if(message.type === "createOffer"){
            if(ws !== senderSocket){
                return;
            }
            console.log("---offer created---");
            receiverSocket?.send(JSON.stringify({type: "createOffer", sdp: message.sdp}));
        }
        else if(message.type === "createAnswer"){
            if (ws !== receiverSocket) {
                return;
              }
              console.log("---answer created---");
            senderSocket?.send(JSON.stringify({type: "createAnswer", sdp: message.sdp}));
        }
    });
});