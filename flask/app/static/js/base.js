var signData;
var membership;
var pricePerHour;

var signInBtn = document.querySelector("#signin-btn");
var memberBtn = document.querySelector("#member-btn");

async function baseInit(){
    await checkSignedIn();
    signOut();
    handleBtns();
}

async function checkSignedIn(){
    signData = await isSignedIn();
    if (signData){
        membership = signData["info"]["membership"];
        if (membership === "consultant"){
            pricePerHour = signData["info"]["price"];
        }
        toggleBlock(signInBtn, memberBtn);
    }
    document.body.classList.remove("hide");
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
    let chatBtn = document.querySelector("#chat-btn");
    chatBtn.addEventListener("click", function(){location.href = "/chat";})
}

// Utils
function toggleBlock(...targets){
    targets.forEach(target => target.classList.toggle("hide"))
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

    closeImg.src = "/img/icon_close.png";
    msgTitle.textContent = title;

    document.body.appendChild(modal);
    modal.appendChild(windowMsg);
    windowMsg.appendChild(msgBorder);
    windowMsg.appendChild(closeCon);
    closeCon.appendChild(closeImg);
    windowMsg.appendChild(msgTitle);
    windowMsg.appendChild(msgContent);

    closeCon.addEventListener("click", function(){
        hideBlock(windowMsg, modal);
        if (reload == "reload"){
            location.reload(true);
        }
    })
    return msgContent
}

function convertFieldName(fieldCode){
    switch (fieldCode){
        case "ta":
            return "稅務"
        case "ac":
            return "會計"
        case "fi":
            return "金融"
        case "cr":
            return "刑法"
        case "ci":
            return "民法"
        case "co":
            return "公司法"
    }
}

function convertFieldCode(fieldName){
    switch (fieldName){
        case "稅務":
            return "ta"
        case "會計":
            return "ac"
        case "金融":
            return "fi"
        case "刑法":
            return "cr"
        case "民法":
            return "ci"
        case "公司法":
            return "co"
    }
}
