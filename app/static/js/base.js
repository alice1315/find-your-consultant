<<<<<<< HEAD:app/static/js/base.js
=======
var signData;
var membership;
var pricePerHour;

>>>>>>> 3da3ffc (Set function of making quotation.):flask/app/static/js/base.js
var signInBtn = document.querySelector("#signin-btn");
var memberBtn = document.querySelector("#member-btn");
var chatBtn = document.querySelector("#chat-btn");

<<<<<<< HEAD:app/static/js/base.js
function baseInit(){
    checkSignedIn();
=======
var loading = document.querySelector("#loading");

async function baseInit(){
    await checkSignedIn();
>>>>>>> 16009bf (Set permission of getting payment.html and feedback.html.):flask/app/static/js/base.js
    signOut();
    handleBtns();
    convertFieldName();
    convertFieldCode();
}

async function checkSignedIn(){
<<<<<<< HEAD:app/static/js/base.js
    if (await isSignedIn()){
=======
    signData = await isSignedIn();
    if (signData){
        membership = signData["info"]["membership"];
        if (membership === "consultant"){
            pricePerHour = signData["info"]["price"];
        }
<<<<<<< HEAD:app/static/js/base.js
>>>>>>> 3da3ffc (Set function of making quotation.):flask/app/static/js/base.js
        toggleBlock(signInBtn, memberBtn);
=======
        toggleBlock(signInBtn, memberBtn, chatBtn);
>>>>>>> 33df9f5 (Modified intro in index.html and checked path in sign.html.):flask/app/static/js/base.js
    }
    showBlock(document.body);
}

function handleBtns(){
    let logo = document.querySelector(".web-title");
    logo.addEventListener("click", function(){
        location.href = "/";
    })

    signInBtn.addEventListener("click", function(){
        location.href = "/signin";
    })

    memberBtn.addEventListener("click", function(){
        let memberCenter = document.querySelector("#member-center");
        memberCenter.classList.toggle("slideshow");
    })

<<<<<<< HEAD:app/static/js/base.js
    
=======
    // Chat
    chatBtn.addEventListener("click", function(){location.href = "/chat";})

    // Memberpage
    let memberPageBtn = document.querySelector("#memberpage-btn");
<<<<<<< HEAD:app/static/js/base.js
    memberPageBtn.addEventListener("click", function(){
        if (membership === "member"){
            console.log(authData);
            location.href = `/memberpage/member?id=${signData["info"]["id"]}`;
        } else{
            location.href = `/memberpage/consultant?id=${signData["info"]["id"]}`;
        }
        
    })
>>>>>>> 78d0006 (Set memberpage.html.):flask/app/static/js/base.js
=======
    memberPageBtn.addEventListener("click", function(){location.href = "/memberpage";})
>>>>>>> 7a6bc4b (Finished rendering memberpage.html.):flask/app/static/js/base.js
}

// Utils
function toggleBlock(...targets){
    targets.forEach(target => target.classList.toggle("hide"))
}

<<<<<<< HEAD:app/static/js/base.js
<<<<<<< HEAD:app/static/js/base.js
=======
=======
function showBlock(...targets){
    targets.forEach(target => target.classList.remove("hide"))
}

>>>>>>> 8bc761f (Set function and view of payment.):flask/app/static/js/base.js
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
        closeWindowMsg();
        if (reload == "reload"){
            location.reload(true);
        }
    })
    return msgContent
}

<<<<<<< HEAD:app/static/js/base.js
>>>>>>> 3da3ffc (Set function of making quotation.):flask/app/static/js/base.js
=======
// Utils
function closeWindowMsg(){
    document.querySelector(".window-msg").remove();
    document.querySelector(".modal").remove();
}

>>>>>>> 277f56c (Set function of ending case.):flask/app/static/js/base.js
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
<<<<<<< HEAD:app/static/js/base.js
}
=======
}

function convertMembership(membership){
    switch (membership){
        case "member":
            return "一般會員"
        case "consultant":
            return "專業顧問"
    }
}
<<<<<<< HEAD:app/static/js/base.js
>>>>>>> 7a6bc4b (Finished rendering memberpage.html.):flask/app/static/js/base.js
=======

function getCurrentTime(){
    let d = new Date();
    let h = String(d.getHours()).padStart(2, '0');
    let m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`
}
>>>>>>> c45cf3d (Set time of chatting.):flask/app/static/js/base.js
