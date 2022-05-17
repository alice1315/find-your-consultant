var signInBtn = document.querySelector("#signin-btn");
var memberBtn = document.querySelector("#member-btn");

function baseInit(){
    checkSignedIn();
    signOut();
    handleBtns();
    convertFieldName();
    convertFieldCode();
}

async function checkSignedIn(){
    if (await isSignedIn()){
        toggleBlock(signInBtn, memberBtn);
    }
    document.body.classList.remove("hide");
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

    
}

function toggleBlock(...targets){
    targets.forEach(target => target.classList.toggle("hide"))
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