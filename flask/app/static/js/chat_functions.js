var funcData;

function setChatFunctions(caseId, sendBtn, funcUl){
    let functions = funcUl.children;
    if (membership === "member"){
        // showBlock(functions[1], functions[3], functions[4]);
        showBlock(functions[1], functions[3]);
        toMakePayment(caseId);
        agreeEndCase(caseId, sendBtn);
    } else{
        // showBlock(functions[0], functions[2], functions[4]);
        showBlock(functions[0], functions[2]);
        makeQuotation(caseId, sendBtn);
        endCase(caseId, sendBtn);
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
    btn.addEventListener("click", async function(){
        let status = await getCaseStatus(caseId);

        if (status === "前置諮詢" || status === "提出報價"){
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

                await callFunctionApi("/api/quotation", fetchOptions);

                if (funcData["ok"]){
                    messageWindow.value = "";
                    setQuotationMsg(hr, totalPrice);
                    closeWindowMsg();
                    sendBtn.click();
                }
            })
        } else{
            showPermissionError();
        }
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
您好，經評估後此案件的處理時數為 ${hr} 小時，
諮詢時薪為 $ ${pricePerHour} /時，總報價為 $ ${totalPrice} ，
若您有意願繼續諮詢，請點選下方【進行付款】之按鈕以進入正式諮詢，謝謝！`;
}

// to Payment (for member)
function toMakePayment(caseId){
    let btn = document.querySelector("#pay-btn");
    btn.addEventListener("click", async function(){
        let status = await getCaseStatus(caseId);

        if (status === "提出報價"){
            location.href = `/payment?case=${caseId}`;
        } else{
            showPermissionError();
        }
        
    })
}

// End case (for consultant)
function endCase(caseId, sendBtn){
    let btn = document.querySelector("#end-btn");
    btn.addEventListener("click", async function(){
        let status = await getCaseStatus(caseId);

        if (status === "正式諮詢"){
            let submitBtn = renderEndCaseWindow();
            submitBtn.addEventListener("click", async function(){
                let fetchOptions = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"case_id": caseId})
                }
                await callFunctionApi("/api/endcase", fetchOptions);

                if (funcData["ok"]){
                    messageWindow.value = "";
                    setEndCaseMsg(caseId);
                    closeWindowMsg();
                    sendBtn.click();
                } 
            })
        } else{
            showPermissionError();
        }
    })
}

function renderEndCaseWindow(){
    let msgContent = renderMsgWindow("顧問提出結案");

    msgContent.appendChild(createDocElement("div", "msg", "提出結案請求後經客戶同意即可結案"));
    msgContent.appendChild(createDocElement("div", "msg", "＊ 結案後無法再進行諮詢對話 ＊"));

    let exitBtn = createDocElement("button", "another-btn", "返回聊天室");
    msgContent.appendChild(exitBtn);
    exitBtn.addEventListener("click", closeWindowMsg);

    let submitBtn = createDocElement("button", "btn msg-btn", "確認結案");
    msgContent.appendChild(submitBtn);

    return submitBtn
}

function setEndCaseMsg(caseId){
    messageWindow.value = `【顧問提出結案】
您好，經評估後此案件 ${caseId} 已完成所有諮詢流程，
若您同意就此結束，請點選下方【同意結案】之按鈕以正式結案，謝謝！`;
}

// Agree end case (for member)
function agreeEndCase(caseId, sendBtn){
    let btn = document.querySelector("#agree-btn");
    btn.addEventListener("click", async function(){
        let status = await getCaseStatus(caseId);

        if (status === "提出結案"){
            let submitBtn = renderAgreeWindow();
            submitBtn.addEventListener("click", function(){
                messageWindow.value = "";
                setAgreeMsg(caseId);
                closeWindowMsg();
                sendBtn.click();
                location.href = `/feedback?case=${caseId}`;
            })
        } else{
            showPermissionError();
        }
    })
}

function renderAgreeWindow(){
    let msgContent = renderMsgWindow("同意結案結案");

    msgContent.appendChild(createDocElement("div", "msg", "感謝您此次的諮詢，點擊確認後則正式結案！"));
    msgContent.appendChild(createDocElement("div", "msg", "＊ 結案後無法再進行諮詢對話 ＊"));

    let exitBtn = createDocElement("button", "another-btn", "返回聊天室");
    msgContent.appendChild(exitBtn);
    exitBtn.addEventListener("click", closeWindowMsg);

    let submitBtn = createDocElement("button", "btn msg-btn", "確認結案");
    msgContent.appendChild(submitBtn);

    return submitBtn
}

function setAgreeMsg(caseId){
    messageWindow.value = `【客戶同意結案】
您好，已有共識對此案件編號： ${caseId} 進行結案，感謝您的協助！`;
}

// Utils
async function getCaseStatus(caseId){
    let fetchOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"case_id": caseId})
    }

    await callFunctionApi("/api/status", fetchOptions);

    return funcData["data"]["status"]
}

function showPermissionError(){
    let msgContent = renderMsgWindow("錯誤訊息");
    msgContent.innerText = "專案階段暫無法執行此功能，謝謝！"
}
