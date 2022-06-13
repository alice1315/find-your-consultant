var caseId;
var paymentUrl = "/api/payment";
var paymentData;
var paymentMsg = document.querySelector("#payment-msg");

async function paymentInit(){
    await baseInit();
    getCaseId();
    await initPaymentData(paymentUrl + `?case=${caseId}`, {method: "GET"});
    tappaySetUp();
    renderPaymentPage();
    endLoading();
    makePayment();
}

function getCaseId(){
    let url = new URL(window.location.href);
    caseId = url.searchParams.get("case");
}

async function initPaymentData(url, fetchOptions){
    if (signData){
        await fetch(url, fetchOptions)
        .then((resp) => {
            return resp.json()
        }).then((result) => {
            paymentData = result;
        })
    } else{
        location.href = "/";
    }
}

async function renderPaymentPage(){
    let status = await getCaseStatus(caseId);

    if (status && status === "提出報價"){
        // Set payment info
        document.querySelector("#case-id").innerText = paymentData["data"]["case_id"];
        document.querySelector("#field").innerText = paymentData["data"]["field_name"];
        document.querySelector("#consultant").innerText = paymentData["data"]["name"];
        document.querySelector("#job-title").innerText = paymentData["data"]["job_title"];
        document.querySelector("#price-per-hour").innerText = paymentData["data"]["price_per_hour"];
        document.querySelector("#hours").innerText = paymentData["data"]["hours"];
        document.querySelector("#total-price").innerText = paymentData["data"]["total_price"];

        // Set contact info
        document.querySelector("#contact-name").setAttribute("value", memberName);
        document.querySelector("#contact-email").setAttribute("value", memberEmail);
        document.querySelector("#contact-phone").setAttribute("value", memberPhone);

        document.querySelector(".another-btn").addEventListener("click", function(){
            location.href = "/chat";
        })
    }else {
        location.href = "/";
    }
}

function tappaySetUp(){
    TPDirect.setupSDK(124039, "app_RMLknzGTJatrHEEvYsMcWbFpiYvoiWlBqN4KQw3TLcp2Pd9g5164wJOrlsXr", "sandbox");

    let fields = {
        number: {
            element: document.querySelector('#card-number'),
            placeholder: '4242 4242 4242 4242'
        },
        expirationDate: {
            element: document.querySelector('#card-expiration-date'),
            placeholder: '01 / 23'
        },
        ccv: {
            element: document.querySelector('#card-ccv'),
            placeholder: '123'
        }
    }
    
    TPDirect.card.setup({
        fields: fields,
        styles: {
            ':focus': {'color': '#666666'},
            '.valid': {'color': 'green'},
            '.invalid': {'color': 'red'},
        }
    })
}

function updateCardStatus(field, msg){
    switch(field){
        case 0:
            msg.innerText = "";
            break;
        case 1:
            msg.innerText = "請填寫資料";
            break;
        case 2:
            msg.innerText = "輸入資料有誤";
            break;
        case 3:
            msg.innerText = "";
            break;
        default:
            showErrorMsg("field error");
    }
}

function updateContactStatus(contact, msg){
    if (contact.value == ""){
        msg.innerText = "請填寫資料";
        return false
    } else{
        msg.innerText = "";
        return true;
    }
}

function checkPaymentStatus(){
    let tappayStatus = TPDirect.card.getTappayFieldsStatus();

    updateCardStatus(tappayStatus.status.number, document.querySelector("#number-msg"));
    updateCardStatus(tappayStatus.status.expiry, document.querySelector("#expiry-msg"));
    updateCardStatus(tappayStatus.status.ccv, document.querySelector("#ccv-msg"));

    let con1 = updateContactStatus(document.querySelector("#contact-name"), document.querySelector("#name-msg"));
    let con2 = updateContactStatus(document.querySelector("#contact-email"), document.querySelector("#email-msg"));
    let con3 = updateContactStatus(document.querySelector("#contact-phone"), document.querySelector("#phone-msg"));
    
    if (tappayStatus.canGetPrime === false | !con1 | !con2 | !con3){
        paymentMsg.innerText = "資訊有誤，請再次確認";
        return false;
    } else{
        paymentMsg.innerText = "";
        return true;
    }
}

function makePayment(){
    let form = document.querySelector("#payment-form");
    function handlePaymentSubmit(event){
        event.preventDefault();

        let reqForm = new FormData(form);
        reqForm.append("case_id", caseId)

        // Get prime
        if (checkPaymentStatus()){
            TPDirect.card.getPrime(async(result) => {
                if (result.status !== 0){
                    showErrorMsg(result.msg);
                    return;
                }

                let prime = result.card.prime;
                reqForm.append("prime", prime);

                let fetchOptions = {
                    method: "POST",
                    body: reqForm
                }

                await initPaymentData("/api/payment", fetchOptions);
                
                if (paymentData["ok"]){
                    socket.emit("change_status", {"case_id": caseId, "status": "正式諮詢"});
                    renderPaymentOkMsg();
                } else{
                    renderPaymentErrorMsg();
                }
            })
        }
    }
    form.addEventListener("submit", handlePaymentSubmit)
}

// Rendering Msg
function renderPaymentOkMsg(){
    let msgContent = renderMsgWindow("付款成功");
    msgContent.appendChild(createDocElement("div", "msg", "感謝您的訂購，案件已轉為正式諮詢"));

    let exitBtn = createDocElement("button", "btn msg-btn", "返回聊天室");
    msgContent.appendChild(exitBtn);
    exitBtn.addEventListener("click", function(){
        location.href = "/chat";
    })

    hideBlock(document.querySelector(".close"));
}

function renderPaymentErrorMsg(){
    let msgContent = renderMsgWindow("付款失敗");
    msgContent.appendChild(createDocElement("div", "msg", "請重新確認信用卡資訊，或與發卡銀行確認"));

    let exitBtn = createDocElement("button", "another-btn", "返回聊天室");
    msgContent.appendChild(exitBtn);
    exitBtn.addEventListener("click", function(){
        location.href = "/chat";
    })

    let repayBtn = createDocElement("button", "btn", "重新付款");
    msgContent.appendChild(repayBtn);
    repayBtn.addEventListener("click", function(){
        location.reload(true);
    }) 
}
