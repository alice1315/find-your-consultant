function indexInit(){
    renderInfo();
    handleSignUpBtn();
    handleFieldBtns();
}

function renderInfo(){
    let info = document.querySelectorAll("input[name='intro-list']");
    info.forEach((e) => {
        e.addEventListener("change", function(e){
            if (e.target.value === "for-member"){
                showBlock(document.querySelector("#member-intro"));
                hideBlock(document.querySelector("#consultant-intro"));
            } else{
                hideBlock(document.querySelector("#member-intro"));
                showBlock(document.querySelector("#consultant-intro"));
            }
        })
    })
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