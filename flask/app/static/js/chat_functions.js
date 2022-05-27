var funcData;

function renderChatFunctions(caseId, sendBtn){
    let functions = document.querySelector(".functions").children;
    if (membership === "member"){
        toggleBlock(functions[1], functions[3]);
        makePayment();
    } else{
        toggleBlock(functions[0], functions[2], functions[3]);
        makeQuotation(caseId, sendBtn);
    }
}

async function callFunctionApi(url, fetchOptions){
    await fetch(url, fetchOptions)
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        funcData = result
    })
}

// Quotation (for consultant)
function makeQuotation(caseId, sendBtn){
    let btn = document.querySelector("#quotation-btn");
    btn.addEventListener("click", function(){
        let submitBtn = renderQuotationWindow();
        submitBtn.addEventListener("click", async function(){
            let hr = document.querySelector("#hr").value;
            let totalPrice = hr * pricePerHour;

            let reqData = {
                "case_id": caseId,
                "price_per_hour": pricePerHour,
                "hours": hr,
                "total_price": totalPrice
            }

            let fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reqData)
            }

            await callFunctionApi("/api/booking", fetchOptions);

            if (funcData["ok"]){
                messageWindow.value = "";
                setQuotationMsg(hr, totalPrice);
                closeWindowMsg();
                sendBtn.click();
            }
        })
    })
}

function renderQuotationWindow(){
    let msgContent = renderMsgWindow("顧問進行報價");
    let hrInput = createDocElement("input", "msg-input");
    hrInput.id = "hr";
    hrInput.placeholder = "以整數小時為單位"

    msgContent.appendChild(createDocElement("div", "msg", "請輸入此案件預計處理時數以進行報價"));
    msgContent.appendChild(createDocElement("div", "msg", "＊ 可更新報價，客戶付款以最新報價為主 ＊"));
    msgContent.appendChild(hrInput);

    let submitBtn = createDocElement("button", "btn", "送出");
    msgContent.appendChild(submitBtn);
    return submitBtn
}

function setQuotationMsg(hr, totalPrice){
    messageWindow.value = `【顧問報價】
您好，經顧問評估後此案件的處理時數為 ${hr} 小時，
諮詢時薪為 $ ${pricePerHour} /時，總報價為 $ ${totalPrice} ，
若您有意願繼續諮詢，請點選下方【進行付款】之按鈕以進入正式諮詢，謝謝！`;
}

// Payment (for member)
function makePayment(){
    let btn = document.querySelector("#pay-btn");
    btn.addEventListener("click", function(){
        location.href = "/payment";
    })
}

// Utils
function closeWindowMsg(){
    document.querySelector(".window-msg").remove();
    document.querySelector(".modal").remove();
}