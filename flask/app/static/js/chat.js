var chatData;
var socket;
var windowCaseId = "";
var messageWindow = document.querySelector("#message");

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
        toggleBlock(document.querySelector(".footer"));
        await getChatList();
        renderChatList();
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

        let caseId = chat["id"];
        let status = chat["status"];

        setChatList(picUrl, fieldCode, name, jobTitle, caseId, status);
    })
}

function setChatList(picUrl, fieldCode, name, jobTitle, caseId, status){
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
        handleSmallClick(small, name, jobTitle, fieldCode, picUrl, caseId, status);
    })
}

function handleSmallClick(small, name, jobTitle, fieldCode, picUrl, caseId, status){
    // Leave previous room
    socket.emit("leave", {"case_id": windowCaseId})

    // Set page
    let smalls = document.querySelectorAll(".left-small");
    smalls.forEach(e => e.style.borderLeft = "5px solid white");
    small.style.borderLeft = "5px solid #EB8528";

    document.querySelector("#right-name").innerText = name;
    document.querySelector("#right-job-title").innerText = jobTitle;
    document.querySelector("#right-field").innerText = convertFieldName(fieldCode) + "案件： ";
    document.querySelector("#case-id").innerText = caseId;
    let titleDiv = document.querySelector(".right-title");
    let statusDiv = document.querySelector("#status");
    statusDiv.innerText = status;

    if (status === "前置諮詢"){
        titleDiv.style.backgroundColor = "rgba(207, 75, 73, 0.2)";
        statusDiv.style.color = "#CF4B49";
    } else if(status === "正式諮詢"){
        titleDiv.style.backgroundColor = "rgba(12, 135, 74, 0.2)";
        statusDiv.style.color = "#0C874A";
    }

    // Set chat window and send btn
    let chatWindow = renderChatWindow();
    let sendBtn = renderSendBtn();
    let funcUl = renderChatFunctionList();
    startChat(picUrl, chatWindow, sendBtn, caseId);
    setChatFunctions(caseId, sendBtn, funcUl);
}

// Socket & Handle chat window
function connect(){
    socket = io.connect();
    socket.on("disconnect", function(){
        console.log("disconnected!");
    })
}

async function startChat(picUrl, chatWindow, sendBtn, caseId){
    windowCaseId = caseId
    let payload = {
        "membership": membership,
        "case_id": windowCaseId
    }

    socket.emit("join", payload);

    await getChatHistory(windowCaseId);
    renderChatHistory(picUrl, chatWindow);
    sendMsg(chatWindow, sendBtn, windowCaseId);
    receiveMsg(picUrl, chatWindow);
}

async function getChatHistory(caseId){
    let reqData = {
        "case_id": caseId
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

function renderChatHistory(picUrl, chatWindow){
    let lines = chatData["data"];

    lines.forEach(function(line){
        let senderMembership = line["sender_membership"];
        let message = line["message"];

        if (senderMembership == membership){
            renderSenderMsg(chatWindow, message);
        } else if (senderMembership !== membership){
            renderReceiverMsg(picUrl, chatWindow, message);
        }
    })
}

// Send & Receive
function sendMsg(chatWindow, sendBtn, caseId){
    function handleSendMsg(){
        let payload = {
            "case_id": caseId,
            "membership": membership,
            "message": messageWindow.value
        }
        socket.emit("send", payload);
        renderSenderMsg(chatWindow, messageWindow.value);
        messageWindow.value = "";
    }

    sendBtn.addEventListener("click", handleSendMsg);
}

function receiveMsg(picUrl, chatWindow){
    socket.on("receive", function(data){
        if (data["receiver_membership"] === membership){
            renderReceiverMsg(picUrl, chatWindow, data["message"]);
        }
    })
}

// Handle rendering messages
function renderSenderMsg(chatWindow, message){
    let chatA = createDocElement("div", "chat-a");

    chatWindow.appendChild(chatA);
    chatA.appendChild(createDocElement("div", "message", message));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderReceiverMsg(picUrl, chatWindow, message){
    let chatB = createDocElement("div", "chat-b");
    let identityB = createDocElement("div", "identity-b");
    let img = document.createElement("img");
    img.src = picUrl;

    chatWindow.appendChild(chatB);
    chatB.appendChild(identityB);
    identityB.appendChild(img);
    chatB.appendChild(createDocElement("div", "message", message));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Other rendering utils
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

function renderChatFunctionList(){
    document.querySelector(".right-function").innerHTML = "";
    let funcUl = createDocElement("ul", "functions");

    let quotationBtn = createDocElement("li", "hide", "進行報價");
    quotationBtn.id = "quotation-btn";

    let payBtn = createDocElement("li", "hide", "進行付款");
    payBtn.id = "pay-btn";

    let endBtn = createDocElement("li", "hide", "提出結案");
    endBtn.id = "end-btn";

    let agreeBtn = createDocElement("li", "hide", "同意結案");
    agreeBtn.id = "agree-btn";
    
    let helpBtn = createDocElement("li", "hide", "案件申訴");
    helpBtn.id = "help-btn";

    document.querySelector(".right-function").appendChild(funcUl);
    funcUl.appendChild(quotationBtn);
    funcUl.appendChild(payBtn);
    funcUl.appendChild(endBtn);
    funcUl.appendChild(agreeBtn);
    funcUl.appendChild(helpBtn);

    return funcUl
}
