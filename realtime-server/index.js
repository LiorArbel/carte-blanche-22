"use strict";
exports.__esModule = true;
// Importing the required modules
var ws_1 = require("ws");
var readline = require("node:readline");
console.log("asdasd");
// Creating a new websocket server
var wss = new ws_1.WebSocketServer({ port: 8080 });
// Creating connection using websocket
wss.on("connection", function (ws) {
    console.log("new client connected");
    // sending message
    ws.on("message", function (data) {
        console.log("Client has sent us: ".concat(data));
    });
    // handling what to do when clients disconnects from server
    ws.on("close", function () {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred");
    };
});
console.log("The WebSocket server is running on port 8080");
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('guess> ');
rl.prompt();
rl.on('line', function (line) {
    if (line === "close")
        rl.close();
    if (line === "beep")
        wss.clients.forEach(function (c) { return c.send("beep"); });
    rl.prompt();
}).on('close', function () {
    process.exit(0);
});
