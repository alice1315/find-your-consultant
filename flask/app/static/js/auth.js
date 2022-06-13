var authUrl = "/api/auth"
var authData;

async function authInit(){
    await baseInit();
    checkSignPath();
}

async function isSignedIn(){
    await initAuthData({method: "GET"});
    if (authData["data"]){
        return authData["data"];
    } else{
        return false;
    }
}

function checkSignPath(){
    let path = window.location.pathname.split("/")[1];
    if (signData){
        location.href = "/";
    } else if (path === "signin"){
        endLoading();
        signIn();
        setTestAccount();
        handleToSignUpBtn();
    } else if (path === "signup"){
        renderSignUpPage();
        endLoading();
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

    async function handleSignInSubmit(event){
        event.preventDefault();

        let reqForm = new FormData(form);
        let fetchOptions = {
            method: "PATCH",
            body: reqForm
        }

        await initAuthData(fetchOptions);

        if (authData["ok"]){
            location.href = "/";
        } else{
            showSignMsg("登入失敗：" + authData["message"])
        }
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
            location.href = "/";
        } else{
            showSignMsg("註冊失敗：" + authData["message"])
        }
    }

    form.addEventListener("submit", handleSignUpSubmit);
}

// Sign Out
function signOut(){
    async function handleSignOutSubmit(){
        await initAuthData({method: "DELETE"});

        if (authData["ok"]){
            location.reload(true);
        }
    }

    let btn = document.querySelector("#signout-btn");
    btn.addEventListener("click", handleSignOutSubmit);
}

function showSignMsg(message){
    let signMsg = document.querySelector(".sign-msg");
    signMsg.innerHTML = message;
}

// Others
function handleToSignUpBtn(){
    let toMember = document.querySelector("#to-signup-member");
    toMember.addEventListener("click", function(){location.href = "signup/member"});

    let toConsultant = document.querySelector("#to-signup-consultant");
    toConsultant.addEventListener("click", function(){location.href = "signup/consultant"});
}

function setTestAccount(){
    let email = document.querySelector("input[name='email']");
    email.setAttribute("value", "test_member@gmail.com");
    let password = document.querySelector("input[name='password']");
    password.setAttribute("value", "test");

    let signInMembership = document.querySelectorAll("input[name='membership']");
    signInMembership.forEach((e) => {
        e.addEventListener("change", function(e){
            if (e.target.value === "member"){
                email.setAttribute("value", "test_member@gmail.com");
            } else{
                email.setAttribute("value", "test_consultant@gmail.com");
            }
        })
    })
}