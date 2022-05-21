var signData;
var membership;

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

function toggleBlock(...targets){
    targets.forEach(target => target.classList.toggle("hide"))
}

function createDocElement(element, className, text){
    let e = document.createElement(element);
    if (className){e.setAttribute("class", className);}
    if (text){e.innerText = text;}
    return e
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
