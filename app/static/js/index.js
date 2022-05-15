function indexInit(){
    handleSignUpBtn();
}

function handleSignUpBtn(){
    let memberBtn = document.getElementById("member-signup-btn");
    let consultantBtn = document.getElementById("consultant-signup-btn");

    memberBtn.addEventListener("click", function(){
        location.href = "/signup/member";
    });
    consultantBtn.addEventListener("click", function(){
        location.href = "/signup/consultant";
    })
}