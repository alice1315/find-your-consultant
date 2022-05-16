var authUrl = "/api/auth"
var authData;

function authInit(){
    checkLocation();
}

function checkLocation(){
    let path = window.location.pathname.split("/")[1];
    if (path === "signin"){
        signIn();
    } else if (path === "signup"){
        renderSignUpPage();
        signUp();
    }
}

async function initAuthData(fetchOptions){
    await fetch(authUrl, fetchOptions)
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        authData = result;
    })
}

// Sign In
function signIn(){
    let form = document.querySelector("#signin-form");
    // let membership = 

    function handleSignInSubmit(event){
        event.preventDefault();

        let reqForm = new FormData(form);
        console.log("in signin");
    }

    form.addEventListener("submit", handleSignInSubmit);
}

// Sign Up
function renderSignUpPage(){
    let membership = window.location.pathname.split("/")[2];
    let pageTitle = document.querySelectorAll(".page-title");
    let pro = document.querySelector(".signup-pro");

    if (membership === "consultant"){
        pageTitle[0].classList.toggle("hide");
        pro.classList.toggle("hide");
    } else{
        pageTitle[1].classList.toggle("hide");
    } 
}

function signUp(){
    let form = document.querySelector("#signup-form");
    let membership = window.location.pathname.split("/")[2];

    async function handleSignUpSubmit(event){
        event.preventDefault();

        let reqForm = new FormData(form);
        reqForm.append("membership", membership);

        if(membership === "consultant"){
            let fields = reqForm.getAll("field");
            reqForm.delete("field");
            reqForm.append("fields", fields)
        }
        
        let fetchOptions = {
            method: "POST",
            body: reqForm
        };

        await initAuthData(fetchOptions);

        if (authData["ok"]){
            location.href = "/signin";
        } else if(authData["error"]){
            showMsg("註冊失敗：" + authData["message"])
        }
    }

    form.addEventListener("submit", handleSignUpSubmit);
}

function showMsg(message){
    let signMsg = document.querySelector(".sign-msg");
    signMsg.innerHTML = message;
}
