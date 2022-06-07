// Importing the required modules
import { WebSocketServer } from 'ws';

import * as readline from 'node:readline';

console.log("asdasd");
 
// Creating a new websocket server
const wss = new WebSocketServer({port: 8080});
 
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
    // sending message
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 8080");

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('guess> ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "close") rl.close();
    if (line === "beep") wss.clients.forEach(c => c.send("beep"));
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});