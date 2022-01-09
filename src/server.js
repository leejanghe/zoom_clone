import http from "http";
import express from 'express';
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/*", (req, res)=>{
    res.redirect("/");
})

const handleListen = () => {
    console.log('Listening on port 3000');
}
// ws는 Expree를 지원 안한다.
// app.listen(3000, handleListen);

const server = http.createServer(app);

// 브라우저 상의 websocket 연결
const wss = new WebSocket.Server({ server });


wss.on("connection", (socket)=>{
    console.log("connected to client!!!");
    socket.on("close", ()=>{
        console.log('Disconnected from client');
    });
    socket.on("message", (message)=>{
        console.log(message.toString('utf8'))
    });
    socket.send("hi");
});

server.listen(3000, handleListen);