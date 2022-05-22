var chatData;
var socket;

async function chatInit(){
    await baseInit();
    renderPage();
    connect();
}

async function initChatData(fetchOptions){
    await fetch("/api/chat", fetchOptions)
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        chatData = result;
    })
}

async function renderPage(){
    if (signData){
        await getChatList();
        renderChatList();
        renderChatFunctions();
    } else{
        location.href = "/";
    }
}

// Handle chat list
async function getChatList(){
    await initChatData({method: "GET"});
}

function renderChatList(){
    chatData["data"].forEach(function(chat){
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
        let smalls = document.querySelectorAll(".left-small");
        smalls.forEach(e => e.style.border = "1px solid black");

        small.style.border = "3px solid #EB8528";
        let chatWindow = renderChatWindow();
        let sendBtn = renderSendBtn();
        startChat(chatWindow, sendBtn, roomId, receiverMembership, receiverId);
    })
}

function renderChatFunctions(){
    let functions = document.querySelector(".functions").children;
    if (membership === "member"){
        toggleBlock(functions[1]);
    } else{
        toggleBlock(functions[0], functions[2]);
    }
}

// Socket
function connect(){
    socket = io.connect();
}

function disconnect(){
    socket.on("disconnect", function(){
        console.log("disconnected!");
    })
}

async function startChat(chatWindow, sendBtn, roomId, receiverMembership, receiverId){
    await getChatHistory(roomId);
    renderChatHistory(chatWindow);
    sendMsg(chatWindow, sendBtn, roomId, receiverMembership, receiverId);
    receiveMsg(chatWindow);
}

async function getChatHistory(roomId){
    let reqData = {
        "room_id": roomId
    }

    let fetchOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
    }

    await initChatData(fetchOptions);
}

function renderChatHistory(chatWindow){
    let lines = chatData["data"];

    lines.forEach(function(line){
        let senderMembership = line["sender_membership"];
        let message = line["messages"];

        if (senderMembership == membership){
            renderSenderMsg(chatWindow, message);
        } else if (senderMembership != membership){
            renderReceiverMsg(chatWindow, message);
        }
    })
}

function sendMsg(chatWindow, sendBtn, roomId, receiverMembership, receiverId){
    function handleSendMsg(){
        let message = document.querySelector("#message");
        let payload = {
            "room_id": roomId,
            "receiver_membership": receiverMembership,
            "receiver_id": receiverId,
            "message": message.value
        }
        socket.emit("send", payload);
        renderSenderMsg(chatWindow, message.value);
        message.value = "";
    }

    sendBtn.addEventListener("click", handleSendMsg);
}

function receiveMsg(chatWindow){
    socket.on("receive", function(message){
        renderReceiverMsg(chatWindow, message);
    })
}

// Handle rendering messages
function renderSenderMsg(chatWindow, message){
    let chatA = createDocElement("div", "chat-a");

    chatWindow.appendChild(chatA);
    chatA.appendChild(createDocElement("div", "message", message));
    chatA.appendChild(createDocElement("div", "identity-a", "我"));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderReceiverMsg(chatWindow, message){
    let chatB = createDocElement("div", "chat-b");

    chatWindow.appendChild(chatB);
    chatB.appendChild(createDocElement("div", "identity-b", "對方"));
    chatB.appendChild(createDocElement("div", "message", message));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderChatWindow(){
    document.querySelector(".right-chat-window").innerHTML = "";
    let chatWindow = createDocElement("div", "right-chat");
    document.querySelector(".right-chat-window").appendChild(chatWindow);
    return chatWindow
}

function renderSendBtn(){
    document.querySelector(".right-send").innerHTML = "";
    let sendBtn = createDocElement("button", "btn", "送出");
    document.querySelector(".right-send").appendChild(sendBtn);
    return sendBtn
}
