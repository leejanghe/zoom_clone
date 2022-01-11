const messageList = document.querySelector("ul")
const messageForm = document.querySelector("#message");
const nickFrom = document.querySelector("#nick");


// server로서의 web소켓 연결
const socket = new WebSocket(`ws://${window.location.host}`);



function makeMessage(type, payload){
    const msg ={type, payload};
    return JSON.stringify(msg)
}



// 메세지 받기

socket.addEventListener("open", ()=>{
    console.log("connected to server!");
})

socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
    console.log("New message: ", message.data);
})

socket.addEventListener("close", ()=>{
    console.log("disconnected from server!");
})

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    // console.log(input.value);
    input.value='';
}


function handleNickSumit(event){
    event.preventDefault();
    const input = nickFrom.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    // console.log(input.value);
    input.value='';
}

messageForm.addEventListener("submit", handleSubmit);
nickFrom.addEventListener("submit", handleNickSumit);

// setTimeout(()=>{
//     socket.send("hi from the browser!");
// },5000)