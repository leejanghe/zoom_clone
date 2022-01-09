// alert("hi");
// server로서의 web소켓 연결
const socket = new WebSocket(`ws://${window.location.host}`);

// 메세지 받기

socket.addEventListener("open", ()=>{
    console.log("connected to server!");
})

socket.addEventListener("message", (message)=>{
    console.log("just got this: ", message.data, "from the server");
})

socket.addEventListener("close", ()=>{
    console.log("disconnected from server!");
})

setTimeout(()=>{
    socket.send("hi from the browser!");
},5000)