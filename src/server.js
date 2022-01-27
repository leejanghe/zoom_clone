import http from "http";
import express from 'express';
// import WebSocket from "ws";
import SocketIO from 'socket.io'

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

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);


// 브라우저 상의 websocket 연결
// const wss = new WebSocket.Server({ server });


// function onSocketMessage(message){
//     console.log(message.toString())
// }


// websocket 로직
// const sockets = [];

// wss.on("connection", (socket)=>{
//     sockets.push(socket);
//     socket['nickname'] = "Anonymous";
//     console.log("connected to client!!!");
//     socket.on("close", ()=>{
//         console.log('Disconnected from client');
//     });
//     socket.on("message", (msg)=>{
        
//             const message = JSON.parse(msg.toString())
//             switch(message.type){
//             case "new_message":
//             sockets.forEach((aSocket)=> aSocket.send(`${socket.nickname} : ${message.payload}`));
//             break;

//             case "nickname":
//                 socket['nickname'] = message.payload;
//             break;
//         }
//     })
// });

// 룸 정보를 담을 배열
function publicRooms(){
  const {
    sockets:{
      adapter:{sids, rooms},
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_,key)=>{
    if(sids.get(key) === undefined){
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// user count
function countRoom(roomName){
  return io.sockets.adapter.rooms.get(roomName)?.size;
}


// socket.io 로직
// 두번째인자에서 done은 서버에서 호출하는 함수(이름 작명 가능)

io.on("connection", (socket) => {
    socket['nickname'] = "Anonymous";
    socket.onAny((event) => {
      console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
      socket.join(roomName);
      done();
      socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
      io.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) -1));
    });
    socket.on("disconnect",()=>{
      io.sockets.emit("room_change",publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
      socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
      done();
    });
    socket.on("nickname", (nickname)=> socket["nickname"]=nickname)
  });

httpServer.listen(3000, handleListen);


