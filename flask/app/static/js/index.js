async function indexInit(){
    await baseInit();
    handleSignUpBtn();
    handleFieldBtns();
    renderInfo();
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
    let infoImg = document.querySelector("#info-img");
    info.forEach((e) => {
        e.addEventListener("change", function(e){
            if (e.target.value === "for-member"){
                showBlock(document.querySelector("#member-intro"));
                hideBlock(document.querySelector("#consultant-intro"));
                infoImg.src = `/img/step/m1.png`;
            } else{
                hideBlock(document.querySelector("#member-intro"));
                showBlock(document.querySelector("#consultant-intro"));
                infoImg.src = `/img/step/c1.png`;
            }
        })
    })
    handleInfoImg();
}

function handleInfoImg(){
    let infoBlocks = document.querySelectorAll(".left-block");
    infoBlocks.forEach((e) => {
        e.addEventListener("mouseover", function(){
            let step = e.id;
            let infoImg = document.querySelector("#info-img");
            infoImg.src = `/img/step/${step}.png`;
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