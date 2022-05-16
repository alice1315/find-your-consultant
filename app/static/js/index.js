function indexInit(){
    handleSignUpBtn();
}

function handleSignUpBtn(){
    let memberBtn = document.querySelector("#member-signup-btn");
    let consultantBtn = document.querySelector("#consultant-signup-btn");

    memberBtn.addEventListener("click", function(){
        location.href = "/signup/member";
    });
    consultantBtn.addEventListener("click", function(){
        location.href = "/signup/consultant";
    })
}