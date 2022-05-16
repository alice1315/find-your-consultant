function indexInit(){
    handleSignUpBtn();
    handleFieldBtns();
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

function handleFieldBtns(){
    let fields = document.querySelectorAll(".field-item");
    fields.forEach(function(field){
        field.addEventListener("click", function(){
            let fieldName = field.innerText;
            let fieldCode = convertFieldCode(fieldName);
            location.href = "/field/" + fieldCode;
        })
    })
}