var chatData;
var doingData;
var finishedData;

var messageWindow = document.querySelector("#message");

async function chatInit(){
    await baseInit();
    renderPage();
}

async function initChatData(url, fetchOptions){
    await fetch(url, fetchOptions)
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
        renderChatList(doingData);
        endLoading();
        changeChatList();
    } else{
        location.href = "/";
    }
}

// Handle chat list
async function getChatListData(status){
    await initChatData(`/api/chatlist?status=${status}`, {method: "GET"});

    return chatData["data"]
}

async function getChatList(){
    doingData = await getChatListData("doing");
    finishedData = await getChatListData("finished");

    document.querySelector("#doing-amount").innerText = doingData.length;
    document.querySelector("#finished-amount").innerText = finishedData.length;
}

function renderChatList(data){
    data.forEach(function(chat){
        let picUrl = chat["pic_url"];
        let field = chat["field_name"];
        let name = chat["name"];
        let jobTitle;
        let readStatus;
        if (membership === "member"){
            jobTitle = chat["job_title"];
            readStatus = chat["member"];
        } else{
            jobTitle = "";
            readStatus = chat["consultant"];
        }

        let caseId = chat["case_id"];

        setChatList(picUrl, field, name, jobTitle, caseId, readStatus);
    })
}

function setChatList(picUrl, field, name, jobTitle, caseId, readStatus){
    let chatListContainer = document.querySelector(".left-list");
    let small = createDocElement("div", "left-small");
    let notification = createDocElement("div", "left-notification hide");
    let picContainer = createDocElement("div", "left-pic");
    let pic = createDocElement("img");

    let infoContainer = createDocElement("div", "left-container");
    let info = createDocElement("div", "left-info");

    chatListContainer.appendChild(small);
    small.appendChild(notification);
    notification.id = caseId;
    if (readStatus > 0){
        showBlock(notification);
    }

    small.appendChild(picContainer);
    picContainer.appendChild(pic);
    pic.src = picUrl;

    small.appendChild(infoContainer);
    infoContainer.appendChild(info);
    info.appendChild(createDocElement("div", "left-field", field));
    info.appendChild(createDocElement("div", "left-name", name));
    info.appendChild(createDocElement("div", "left-job-title", jobTitle));

    small.addEventListener("click", async function(){
        let newStatus = await getCaseStatus(caseId);
        handleSmallClick(small, name, jobTitle, field, picUrl, caseId, newStatus);
    })
}

function handleSmallClick(small, name, jobTitle, field, picUrl, caseId, status){
    // Leave previous room
    socket.emit("leave", {"case_id": windowCaseId})

    // Set page
    let smalls = document.querySelectorAll(".left-small");
    smalls.forEach(e => e.style.borderLeft = "5px solid white");
    small.style.borderLeft = "5px solid #EB8528";

    document.querySelector("#right-name").innerText = name;
    document.querySelector("#right-job-title").innerText = jobTitle;
    document.querySelector("#right-field").innerText = field + "案件： ";
    document.querySelector("#right-case-id").innerText = caseId;
    checkCaseStatus(status);

    // Set chat window and send btn
    let chatWindow = renderChatWindow();
    let sendBtn = renderSendBtn();
    let funcUl = renderChatFunctionList();
    startChat(picUrl, chatWindow, sendBtn, caseId);
    setCaseFunctions(caseId, sendBtn, funcUl);

    // Read notificaiton
    socket.emit("read", {"case_id": caseId, "membership": membership})
    hideBlock(document.querySelector(`#${caseId}`));

    socket.emit("check_unread", {"membership": membership, "id": memberId});
}

async function startChat(picUrl, chatWindow, sendBtn, caseId){
    windowCaseId = caseId;
    let payload = {
        "membership": membership,
        "case_id": windowCaseId
    }

    socket.emit("join", payload);

    await getChatHistory(windowCaseId);
    renderChatHistory(picUrl, chatWindow);

    sendMsg(chatWindow, sendBtn, windowCaseId);
    receiveMsg(picUrl, chatWindow);
    renewStatus();
}

function changeChatList(){
    let chatList = document.querySelectorAll("input[name='chat-list']");
    chatList.forEach((e) => {
        e.addEventListener("change", async function(e){
            cleanWindow();
            if (e.target.value === "doing"){
                document.querySelector(".right-send").innerHTML = "";
                await getChatList();
                renderChatList(doingData);
            } else{
                document.querySelector(".right-send").innerHTML = "";
                await getChatList();
                renderChatList(finishedData);
            }
        })
    })
}

// Handle chat history
async function getChatHistory(caseId){
    await initChatData(`/api/chat?case=${caseId}`, {method: "GET"});
}

function renderChatHistory(picUrl, chatWindow){
    let lines = chatData["data"];

    lines.forEach(function(line){
        let senderMembership = line["sender_membership"];
        let message = line["message"];
        let time = line["send_time"];

        if (senderMembership == membership){
            renderSenderMsg(chatWindow, message, time);
        } else if (senderMembership !== membership){
            renderReceiverMsg(picUrl, chatWindow, message, time);
        }
    })
}

// Send & Receive
function sendMsg(chatWindow, sendBtn, caseId){
    async function handleSendMsg(){
        let status = await getCaseStatus(caseId);
        if (status !== "已結案"){
            let time = getCurrentTime();
            let payload = {
                "case_id": caseId,
                "membership": membership,
                "message": messageWindow.value,
                "time": time
            }

            socket.emit("send", payload);
            renderSenderMsg(chatWindow, messageWindow.value, time);
            messageWindow.value = "";

        } else{
            showErrorMsg("專案階段暫無法執行此功能，謝謝！");
        }
    }
    sendBtn.addEventListener("click", handleSendMsg);
}

function receiveMsg(picUrl, chatWindow){
    socket.on("receive", function(data){
        if (data["receiver_membership"] === membership){
            renderReceiverMsg(picUrl, chatWindow, data["message"], data["time"]);
        }
    })
}

// Handle rendering messages
function renderSenderMsg(chatWindow, message, time){
    let chatA = createDocElement("div", "chat-a");

    chatWindow.appendChild(chatA);
    chatA.appendChild(createDocElement("div", "time", time));
    chatA.appendChild(createDocElement("div", "message", message));
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderReceiverMsg(picUrl, chatWindow, message, time){
    let chatB = createDocElement("div", "chat-b");
    let identityB = createDocElement("div", "identity-b");
    let img = document.createElement("img");
    img.src = picUrl;

    chatWindow.appendChild(chatB);
    chatB.appendChild(identityB);
    identityB.appendChild(img);
    chatB.appendChild(createDocElement("div", "message", message));
    chatB.appendChild(createDocElement("div", "time-container")).appendChild(createDocElement("div", "time", time));
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

    document.querySelector(".right-function").appendChild(funcUl);
    funcUl.appendChild(quotationBtn);
    funcUl.appendChild(payBtn);
    funcUl.appendChild(endBtn);
    funcUl.appendChild(agreeBtn);

    return funcUl
}

// Other utils
function cleanWindow(){
    document.querySelector(".left-list").innerHTML = "";
    document.querySelector(".right-chat-window").innerHTML = "";

    let rightTitle = document.querySelector(".right-title");
    rightTitle.style.backgroundColor = "#FFFFFF";

    document.querySelectorAll(".right-info").forEach((e) => {
        e.innerText = "";
    })
}

function checkCaseStatus(status){
    let titleDiv = document.querySelector(".right-title");
    let statusDiv = document.querySelector("#status");

    statusDiv.innerText = status;

    if (status === "前置諮詢" || status === "提出報價"){
        titleDiv.style.backgroundColor = "rgba(207, 75, 73, 0.2)";
        statusDiv.style.color = "#CF4B49";
    } else if(status === "正式諮詢" || status === "提出結案"){
        titleDiv.style.backgroundColor = "rgba(12, 135, 74, 0.2)";
        statusDiv.style.color = "#0C874A";
    } else if(status === "已結案"){
        titleDiv.style.backgroundColor = "rgba(102, 102, 102, 0.2)";
        statusDiv.style.color = "#666666";
    }
}

function renewStatus(){
    socket.on("renew_status", function(data){
        let status = data["status"];
        checkCaseStatus(status);
    })
}
