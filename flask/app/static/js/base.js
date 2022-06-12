var loader = document.querySelector("#loader");

var signData;
var membership;
var memberId;
var memberName;
var memberEmail;
var memberPhone;
var pricePerHour;

var signInBtn = document.querySelector("#signin-btn");
var memberBtn = document.querySelector("#member-btn");
var chatBtn = document.querySelector("#chat-btn");

var msgNote = document.querySelector("#msg-note");

// loading
document.onreadystatechange = function () {
    if (document.readyState !== 'complete') {
        document.querySelector("#loader").style.visibility = "visible";
    }
}

function endLoading(){
    if (document.readyState === 'complete') {
        hideBlock(loader);
        document.querySelector("body").classList.remove("hidden");
    }
}

async function baseInit(){
    await checkSignedIn();
    signOut();
    handleBtns();
}

async function checkSignedIn(){
    signData = await isSignedIn();
    if (signData){
        membership = signData["info"]["membership"];
        memberId = signData["info"]["id"];
        memberName = signData["info"]["name"];
        memberEmail = signData["info"]["email"];
        if (membership === "consultant"){
            pricePerHour = signData["info"]["price"];
        } else{
            memberPhone = signData["info"]["phone"]
        }

        toggleBlock(signInBtn, memberBtn, chatBtn);

        connectSocket();
        socket.emit("check_unread", {"membership": membership, "id": memberId})
    }
}

function handleBtns(){
    // Logo
    let logo = document.querySelector(".web-title");
    logo.addEventListener("click", function(){location.href = "/";})

    // Sign In
    signInBtn.addEventListener("click", function(){location.href = "/signin";})

    // Member
    memberBtn.addEventListener("click", function(){
        let memberCenter = document.querySelector("#member-center");
        memberCenter.classList.toggle("slideshow");
    })

    // Chat
    chatBtn.addEventListener("click", function(){location.href = "/chat";})

    // Memberpage
    let memberPageBtn = document.querySelector("#memberpage-btn");
    memberPageBtn.addEventListener("click", function(){location.href = "/memberpage";})
}

// Utils
function toggleBlock(...targets){
    targets.forEach(target => target.classList.toggle("hide"))
}

function showBlock(...targets){
    targets.forEach(target => target.classList.remove("hide"))
}

function hideBlock(...targets){
    targets.forEach(target => target.classList.add("hide"))
}

function createDocElement(element, className, text){
    let e = document.createElement(element);
    if (className){e.setAttribute("class", className);}
    if (text){e.innerText = text;}
    return e
}

function renderMsgWindow(title, reload){
    let modal = createDocElement("div", "modal");
    let windowMsg = createDocElement("div", "window-msg");
    let msgBorder = createDocElement("div", "msg-border");
    let closeCon = createDocElement("a", "close");
    let closeImg = createDocElement("img");
    let msgTitle = createDocElement("div", "msg-title");
    let msgContent = createDocElement("div", "msg-content");

    closeImg.src = "/static/img/icon_close.png";
    msgTitle.textContent = title;

    document.body.appendChild(modal);
    modal.appendChild(windowMsg);
    windowMsg.appendChild(msgBorder);
    windowMsg.appendChild(closeCon);
    closeCon.appendChild(closeImg);
    windowMsg.appendChild(msgTitle);
    windowMsg.appendChild(msgContent);

    closeCon.addEventListener("click", function(){
        closeWindowMsg();
        if (reload == "reload"){
            location.reload(true);
        }
    })
    return msgContent
}

function closeWindowMsg(){
    document.querySelector(".window-msg").remove();
    document.querySelector(".modal").remove();
}

function convertFieldName(fieldCode){
    switch (fieldCode){
        case "TA":
            return "稅務"
        case "AC":
            return "會計"
        case "FI":
            return "金融"
        case "CR":
            return "刑法"
        case "CI":
            return "民法"
        case "CO":
            return "公司法"
    }
}

function convertFieldCode(fieldName){
    switch (fieldName){
        case "稅務":
            return "TA"
        case "會計":
            return "AC"
        case "金融":
            return "FI"
        case "刑法":
            return "CR"
        case "民法":
            return "CI"
        case "公司法":
            return "CO"
    }
}

function convertMembership(membership){
    switch (membership){
        case "member":
            return "一般會員"
        case "consultant":
            return "專業顧問"
    }
}

function getCurrentTime(){
    let d = new Date();
    let h = String(d.getHours()).padStart(2, '0');
    let m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`
}
