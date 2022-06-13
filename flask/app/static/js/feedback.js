var feedbackData;
var caseId;

async function feedbackInit(){
    await baseInit();
    getCaseId();
    renderFeedbackPage();
    endLoading();
    sendFeedback();
}

function getCaseId(){
    let url = new URL(window.location.href);
    caseId = url.searchParams.get("case");
}

async function initFeedbackData(fetchOptions){
    if (signData){
        await fetch(`/api/feedback`, fetchOptions)
        .then((resp) => {
            return resp.json();
        }).then((result) => {
            feedbackData = result;
        })
    } else{
        location.href = "/";
    }
}

async function renderFeedbackPage(){
    let status = await getCaseStatus(caseId);

    if (status && status === "已結案"){
        document.querySelector("#case-id").innerText = caseId;
        document.querySelector("#member-name").innerText = memberName;
    } else{
        location.href = "/";
    }
}

function sendFeedback(){
    let form = document.querySelector("#feedback-form");
    async function handleSendFeedback(event){
        event.preventDefault();

        let reqForm = new FormData(form);
        reqForm.append("case_id", caseId)

        let fetchOptions = {
            method: "POST",
            body: reqForm
        }

        await initFeedbackData(fetchOptions);
        
        if (feedbackData["ok"]){
            renderThankyouMsg();
        }
    }

    form.addEventListener("submit", handleSendFeedback);
}

function renderThankyouMsg(){
    let msgContent = renderMsgWindow("感謝您的回饋！");
        msgContent.appendChild(createDocElement("div", "msg", "期待下次再為您服務！"));

        let exitBtn = createDocElement("button", "btn msg-btn", "返回首頁");
        msgContent.appendChild(exitBtn);
        exitBtn.addEventListener("click", function(){
            location.href = "/";
        })
}