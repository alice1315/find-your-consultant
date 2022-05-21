var chatList; 
var socket;

var chatWindow = document.querySelector("#right-chat");

async function chatInit(){
    await baseInit();
    renderPage();
}

async function renderPage(){
    if (signData){
        await initChatListData();
        renderChatList();
        renderChatWindow();
    } else{
        location.href = "/";
    }
}

// Handle chat list
async function initChatListData(){
    await fetch("/api/chat", {method: "GET"})
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        chatList = result["data"];
    })
}

function renderChatList(){
    chatList.forEach(function(chat){
        let picUrl = chat["pic_url"];
        let fieldCode = chat["field_code"];
        let name = chat["name"];
        let jobTitle;
        if (chat["job_title"]){
            jobTitle = chat["job_title"];
        } else{
            jobTitle = "";
        }

        let roomId = chat["id"];
        let receiverMembership;
        let receiverId;
        if (membership === "member"){
            receiverMembership = "consultant";
            receiverId = chat["consultant_id"];
        } else{
            receiverMembership = "member";
            receiverId = chat["member_id"];
        }

        setChatList(picUrl, fieldCode, name, jobTitle, roomId, receiverMembership, receiverId);
    })
}

function setChatList(picUrl, fieldCode, name, jobTitle, roomId, receiverMembership, receiverId){
    let chatListContainer = document.querySelector(".left-list");
    let small = createDocElement("div", "left-small");
    let picContainer = createDocElement("div", "left-pic");
    let pic = createDocElement("img");

    let infoContainer = createDocElement("div", "left-container");
    let info = createDocElement("div", "left-info");

    chatListContainer.appendChild(small);
    small.appendChild(picContainer);
    picContainer.appendChild(pic);
    pic.src = picUrl;

    small.appendChild(infoContainer);
    infoContainer.appendChild(info);
    info.appendChild(createDocElement("div", "left-field", convertFieldName(fieldCode)));
    info.appendChild(createDocElement("div", "left-name", name));
    info.appendChild(createDocElement("div", "left-job-title", jobTitle));

    small.addEventListener("click", function(){
        startChat(roomId, receiverMembership, receiverId);
    })
}

function renderChatWindow(){
    
}

// Handle rendering messages
function renderSenderMsg(message){
    let chatA = createDocElement("div", "chat-a");

    chatWindow.appendChild(chatA);
    chatA.appendChild(createDocElement("div", "message", message));
    chatA.appendChild(createDocElement("div", "identity-a", "我"));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderReceiverMsg(message){
    let chatB = createDocElement("div", "chat-b");

    chatWindow.appendChild(chatB);
    chatB.appendChild(createDocElement("div", "identity-b", "對方"));
    chatB.appendChild(createDocElement("div", "message", message));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Socket
function startChat(roomId, receiverMembership, receiverId){
    connect();
    sendMsg(roomId, receiverMembership, receiverId);
    receiveMsg();
}

function connect(){
    socket = io.connect();
}

function disconnect(){
    socket.on("disconnect", function(){
        console.log("disconnected!");
    })
}

function sendMsg(roomId, receiverMembership, receiverId){
    function handleSendMsg(){
        let message = document.querySelector("#message");
        let payload = {
            "room_id": roomId,
            "receiver_membership": receiverMembership,
            "receiver_id": receiverId,
            "message": message.value
        }
        socket.emit("send", payload);
        renderSenderMsg(message.value);
        message.value = "";
    }

    let btn = document.querySelector("#send-btn");
    btn.addEventListener("click", handleSendMsg)
}

function receiveMsg(){
    socket.on("receive", function(message){
        renderReceiverMsg(message);
    })
}
