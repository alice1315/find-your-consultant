async function indexInit(){
    await baseInit();
    renderInfo();
    endLoading();
    handleSignUpBtn();
    handleFieldBtns();
    handleInfoBtns();
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
    handleInfoImg();
}

function handleInfoImg(){
    let infoBlocks = document.querySelectorAll(".left-block");
    infoBlocks.forEach((e) => {
        e.addEventListener("mouseover", function(){
            document.querySelectorAll(".info-img").forEach((e) => {hideBlock(e);})
            showBlock(document.querySelector(`#img-${e.id}`));
        })
    })
}

function handleInfoBtns(){
    let toField = document.querySelector("#m1");
    toField.addEventListener("click", function(){location.href = "/#fields"});

    let toSignIn = document.querySelector("#m2");
    toSignIn.addEventListener("click", function(){
        if (signData){
            let msgContent = renderMsgWindow("權限提醒");
            msgContent.innerText = "您已為登入狀態";
        } else{
            location.href = "/signup/member";
        }
    });

    let toSignUp = document.querySelector("#c1");
    toSignUp.addEventListener("click", function(){
        if (signData){
            let msgContent = renderMsgWindow("權限提醒");
            msgContent.innerText = "您已為登入狀態";
        } else{
            location.href = "/signup/consultant";
        }
    });
}