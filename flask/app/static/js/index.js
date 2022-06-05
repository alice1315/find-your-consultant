function indexInit(){
    handleSignUpBtn();
    handleFieldBtns();
}

function handleSignUpBtn(){
    let memberBtn = document.querySelector("#member-signup-btn");
    let consultantBtn = document.querySelector("#consultant-signup-btn");
    
    memberBtn.addEventListener("click", function(){
        if (signData){
            let msgContent = renderMsgWindow("權限提醒");
            msgContent.innerText = "您已為登入狀態";
        } else{
            location.href = "/signup/member";
        }
    });
    consultantBtn.addEventListener("click", function(){
        if (signData){
            let msgContent = renderMsgWindow("權限提醒");
            msgContent.innerText = "您已為登入狀態";
        } else{
            location.href = "/signup/consultant";
        }
        
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