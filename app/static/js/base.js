function baseInit(){
    handleBtns();
    handleSignInBtn();
}

function handleBtns(){
    let logo = document.querySelector(".web-title");
    logo.addEventListener("click", function(){
        location.href = "/";
    })
}

function handleSignInBtn(){
    let btn = document.querySelector("#signin-btn");
    btn.addEventListener("click", function(){
        location.href = "/signin";
    })
}