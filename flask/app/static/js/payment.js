var caseId;
var paymentUrl = "/api/payment";
var paymentData;
var paymentMsg = document.querySelector("#payment-msg");

async function paymentInit(){
    await baseInit();
    getCaseId();
    await initPaymentData(paymentUrl + `?case=${caseId}`, {method: "GET"});
    console.log(paymentData);
    renderPaymentPage();
    tappaySetUp();
    makePayment();
}

function getCaseId(){
    let url = new URL(window.location.href);
    caseId = url.searchParams.get("case");
}

async function initPaymentData(url, fetchOptions){
    await fetch(url, fetchOptions)
    .then((resp) => {
        return resp.json()
    }).then((result) => {
        paymentData = result;
    })
}

function renderPaymentPage(){
    // Set payment info
    document.querySelector("#case-id").innerText = paymentData["data"]["id"];
    document.querySelector("#field").innerText = convertFieldName(paymentData["data"]["field_code"]);
    document.querySelector("#consultant").innerText = paymentData["data"]["name"];
    document.querySelector("#job-title").innerText = paymentData["data"]["job_title"];
    document.querySelector("#price-per-hour").innerText = paymentData["data"]["price_per_hour"];
    document.querySelector("#hours").innerText = paymentData["data"]["hours"];
    document.querySelector("#total-price").innerText = paymentData["data"]["total_price"];

    // Set contact info
    document.querySelector("#contact-name").setAttribute("value", signData["info"]["name"]);
    document.querySelector("#contact-email").setAttribute("value", signData["info"]["email"]);

}

function tappaySetUp(){
    TPDirect.setupSDK(124039, "app_RMLknzGTJatrHEEvYsMcWbFpiYvoiWlBqN4KQw3TLcp2Pd9g5164wJOrlsXr", "sandbox");

    let fields = {
        number: {
            element: document.getElementById('card-number'),
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: document.getElementById('card-ccv'),
            placeholder: 'ccv'
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
            console.log("field error");
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
                    console.log("get prime error " + result.msg);
                    return;
                }

                let prime = result.card.prime;
                reqForm.append("prime", prime);

                let fetchOptions = {
                    method: "POST",
                    body: reqForm
                }

                await initPaymentData("/api/payment", fetchOptions);
                
                // let orderNumber = orderData["data"]["number"];
                // if (orderData["data"]["payment"]["status"] == 0){
                //     document.body.innerHTML = "";
                //     location.href = `/thankyou?number=${orderNumber}`;
                // } else{
                //     renderPaymentMsg(orderNumber);
                // }
            })
        }
    }
    form.addEventListener("submit", handlePaymentSubmit)
}
