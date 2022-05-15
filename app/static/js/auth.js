var authUrl = "/api/auth"
var authData;

function authInit(){
    renderAuthPage();
    signUp();
}

async function initAuthData(fetchOptions){
    await fetch(authUrl, fetchOptions)
    .then((resp) => {
        return resp.json();
    }).then((result) =>{
        authData = result;
    })
}

function renderAuthPage(){
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
    async function handleSignUpSubmit(event){
        event.preventDefault();

        let reqForm = new FormData(document.querySelector("#signup-form"));

        let fetchOptions = {
            method: "POST",
            body: reqForm
        };

        await initAuthData(fetchOptions);
        // Show if SignUp succeed or not
    }

    let form = document.querySelector("#signup-form");
    form.addEventListener("submit", handleSignUpSubmit);

}