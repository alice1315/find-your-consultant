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
    let statusDiv = document.querySelector("#status");
    statusDiv.innerText = status;

    if (status === "前置諮詢"){
        statusDiv.style.color = "#CF4B49";
    } else if(status === "正式諮詢"){
        statusDiv.style.color = "#0C874A";
    }


    // Set chat window and send btn
    let chatWindow = renderChatWindow();
    let sendBtn = renderSendBtn();
    startChat(picUrl, chatWindow, sendBtn, caseId);
    renderChatFunctions();
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

// Handle chat functions
function renderChatFunctions(){
    let functions = document.querySelector(".functions").children;
    if (membership === "member"){
        toggleBlock(functions[1], functions[3]);
    } else{
        toggleBlock(functions[0], functions[2], functions[3]);
        makeQuotation();
    }
}

function makeQuotation(){
    let btn = document.querySelector("#quotation-btn");
    btn.addEventListener("click", function(){
        let msgContent = renderMsgWindow("顧問進行報價");
        let hrInput = createDocElement("input", "msg-input");
        hrInput.id = "hr";
        hrInput.placeholder = "請輸入正整數"

        msgContent.appendChild(createDocElement("div", "msg", "請輸入此案件預計處理時數以進行報價"));
        msgContent.appendChild(createDocElement("div", "msg", "（以小時為單位）"));
        msgContent.appendChild(hrInput);

        let submitBtn = createDocElement("button", "btn", "送出");
        msgContent.appendChild(submitBtn);

        submitBtn.addEventListener("click", function(){
            messageWindow.value = "";
            let hr = document.querySelector("#hr").value;
            setQuotationMsg(hr);
            document.querySelector(".window-msg").remove();
            document.querySelector(".modal").remove();
        })
        
    })
}

function setQuotationMsg(hr){
    let totalPrice = hr * pricePerHour;
    messageWindow.value = `【顧問報價】
您好，經顧問評估後此案件的處理時數為 ${hr} 小時，
諮詢時薪為 $ ${pricePerHour} /時，總報價為 $ ${totalPrice} ，
若您願意繼續諮詢，請點選下方【進行付款】之按鈕以進入正式諮詢，謝謝！`;
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
