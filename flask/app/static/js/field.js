var fieldData;
var fieldCode;

async function fieldInit(){
    checkFieldPath();
    await initFieldData();
    renderProfile();
    endLoading();
    await baseInit();
}

function checkFieldPath(){
    fieldCode = window.location.pathname.split("/")[2];
    document.querySelector("#field-name").innerText = convertFieldName(fieldCode);
}

async function initFieldData(){
    await fetch("/api/fields/"+ fieldCode, {method: "GET"})
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        fieldData = result;
    })
}

function renderProfile(){
    let datas = fieldData["data"];
    datas.forEach(function(data){
        let id = data["id"];
        let picUrl = data["pic_url"];
        let name = data["name"];
        let jobTitle = data["job_title"];
        let gender = data["gender"];
        let fields = data["fields"];
        let price = data["price"];
        let agency = data["agency"];

        let ratings = data["ratings"];
        let amount = data["amount"];
        let feedback = data["feedback"];

        setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount, feedback);
    })
}

function setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount, feedback){
    let profileContainer = document.querySelector(".profile-container");
    let profile = createDocElement("div", "profile");
    let profileBasic = createDocElement("div", "profile-basic");
    let picContainer = createDocElement("div", "img-container");
    let pic = createDocElement("img");

    let divUp= createDocElement("div");
    let starContainer = createDocElement("div", "star-container");
    let divInfo = createDocElement("div");
    let divFields = createDocElement("div");

    let profilePro = createDocElement("div", "profile-pro");
    let feedbackBlock = createDocElement("div", "feedback", "案件回饋： ");
    let feedbackContainer = createDocElement("div", "feedback-container");

    let roomBtn = createDocElement("button", "btn start", "尋求諮詢");

    // Basic
    profileContainer.appendChild(profile);
    profile.appendChild(profileBasic);
    profileBasic.appendChild(picContainer);
    picContainer.appendChild(pic);
    pic.src = picUrl;

    profileBasic.appendChild(divUp);
    divUp.appendChild(starContainer);

    for(i = 0; i < ratings; i++){
        let star = createDocElement("div", "star", "★");
        starContainer.appendChild(star);
    }

    divUp.appendChild(divInfo);
    divInfo.appendChild(createDocElement("span", "name", name));
    divInfo.innerHTML += '&nbsp; &nbsp;';
    divInfo.appendChild(createDocElement("span", "job-title", jobTitle));
    divInfo.innerHTML += '&nbsp; &nbsp;';
    divInfo.appendChild(createDocElement("span", "gender", gender));
    divUp.appendChild(divFields);
    fields.forEach(function(field){
        let fieldItem = createDocElement("div", "pro-fields");
        let check = createDocElement("span", "check", `✔`);
        let fieldName = createDocElement("span", "", field);
        divFields.appendChild(fieldItem);
        fieldItem.appendChild(check);
        fieldItem.appendChild(fieldName);
    })

    // Pro
    profile.appendChild(profilePro);
    profilePro.appendChild(createDocElement("div", "price", `諮詢時薪： $ ${price} /元`));
    profilePro.appendChild(createDocElement("div", "agency", `服務機構： ${agency}`));
    if (!amount){amount = 0;}
    profilePro.appendChild(createDocElement("div", "case", `處理案件數： ${amount} 件`));
    profilePro.appendChild(feedbackBlock);
    feedbackBlock.appendChild(feedbackContainer);

    // Feedback
    if (feedback && feedback.length >0){
        if (feedback.length >= 3){
            for (i = 0; i < 3; i ++){
                feedbackContainer.appendChild(createDocElement("div", "feedback-content", " - " + feedback[i]));
            }
        } else{
            for (i = 0; i < feedback.length; i ++){
                feedbackContainer.appendChild(createDocElement("div", "feedback-content", " - " + feedback[i]));
            }
        }
        let more = createDocElement("div", "feedback-more", "more");
        feedbackContainer.appendChild(more);
        more.addEventListener("click", function(){
            let msgContent = renderMsgWindow("案件回饋");
            for (i = 0; i < feedback.length; i ++){
                msgContent.appendChild(createDocElement("div", "feedback-all", " - " + feedback[i]));
            }
        })
    }else {
        feedbackContainer.appendChild(createDocElement("div", "feedback-content", "暫無回饋"));
    }
    
    // Start consultanting
    profile.appendChild(roomBtn);
    roomBtn.addEventListener("click", async function(){
        if (signData && membership === "member"){
            await setRoom(id);
            if (fieldData["ok"]){
                location.href = "/chat";
            } else if (fieldData["error"]){
                showErrorMsg(fieldData["message"]);
            }
        } else if (signData && membership === "consultant"){
            showErrorMsg("請以一般會員身份登入，再點選此功能與專業顧問諮詢！");
        } else{
            location.href = "/signin";
        }
    })
}

async function setRoom(consultantId){
    let reqData = {
        "member_id": memberId,
        "consultant_id": consultantId,
        "field_code": fieldCode
    }

    let formData = JSON.stringify(reqData);

    let fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formData
    }

    await fetch("/api/chat", fetchOptions)
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        fieldData = result;
    })
}