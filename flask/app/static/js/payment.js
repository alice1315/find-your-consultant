async function paymentInit(){
    await baseInit();
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

function checkOrderStatus(){
    let tappayStatus = TPDirect.card.getTappayFieldsStatus();

    updateCardStatus(tappayStatus.status.number, document.getElementById("number-msg"));
    updateCardStatus(tappayStatus.status.expiry, document.getElementById("expiry-msg"));
    updateCardStatus(tappayStatus.status.ccv, document.getElementById("ccv-msg"));

    let con1 = updateContactStatus(contactName, document.getElementById("name-msg"));
    let con2 = updateContactStatus(contactEmail, document.getElementById("email-msg"));
    let con3 = updateContactStatus(contactPhone, document.getElementById("phone-msg"));
    
    if (tappayStatus.canGetPrime === false | !con1 | !con2 | !con3){
        orderMsg.innerText = "訂購資訊有誤，請再次確認";
        return false;
    } else{
        orderMsg.innerText = "";
        return true;
    }
}