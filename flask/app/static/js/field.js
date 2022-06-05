var fieldData;
var fieldCode;

async function fieldInit(){
    await baseInit();
    checkFieldPath();
    await initFieldData();
    renderProfile();
}

function checkFieldPath(){
    fieldCode = window.location.pathname.split("/")[2];
    let fieldName = convertFieldName(fieldCode);
    document.querySelector("#field-name").innerText = fieldName;
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
    let starImg = createDocElement("img");
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
        let star = createDocElement("div", "star");
        starContainer.appendChild(star).appendChild(starImg);
        starImg.src = "/img/p-star.png";
        star.innerHTML += '&nbsp;';
    }

    divUp.appendChild(divInfo);
    divInfo.appendChild(createDocElement("span", "name", name));
    divInfo.innerHTML += '&nbsp; &nbsp;';
    divInfo.appendChild(createDocElement("span", "job-title", jobTitle));
    divInfo.innerHTML += '&nbsp; &nbsp;';
    divInfo.appendChild(createDocElement("span", "gender", gender));
    divUp.appendChild(divFields);
    fields.forEach(function(field){
        let f = createDocElement("div", "pro-fields");
        let s = createDocElement("span", "", field);
        let i = document.createElement("img");
        divFields.appendChild(f);
        f.appendChild(i);
        f.appendChild(s);
        i.src = "/img/check.png";
    })

    // Pro
    profile.appendChild(profilePro);
    profilePro.appendChild(createDocElement("div", "price", `諮詢時薪： $ ${price} /元`));
    profilePro.appendChild(createDocElement("div", "agency", `服務機構： ${agency}`));
    profilePro.appendChild(createDocElement("div", "case", `處理案件數： ${amount} 件`));
    profilePro.appendChild(feedbackBlock);
    feedbackBlock.appendChild(feedbackContainer);

    // Feedback
    if (feedback.length > 0){
        for (i = 0; i < 2; i ++){
            feedbackContainer.appendChild(createDocElement("div", "feedback-content", " - " + feedback[i]["consultant_feedback"]));
        }

        let more = createDocElement("div", "feedback-more", "more");
        feedbackContainer.appendChild(more);
        more.addEventListener("click", function(){
            let msgContent = renderMsgWindow("案件回饋");
            for (i = 0; i < feedback.length; i ++){
                msgContent.appendChild(createDocElement("div", "feedback-all", " - " + feedback[i]["consultant_feedback"]));
            }
        })
    } else{
        feedbackContainer.appendChild(createDocElement("div", "feedback-content", "暫無回饋"));
    }
    
    // Start consultanting
    profile.appendChild(roomBtn);
    roomBtn.addEventListener("click", function(){
        if (signData && membership === "member"){
            setRoom(id);
            location.href = "/chat";
        } else if (signData && membership === "consultant"){
            let msgContent = renderMsgWindow("權限提醒");
            msgContent.innerText = "請以一般會員身份登入，再點選此功能與專業顧問諮詢！";
        }else{
            location.href = "/signin";
        }
    })
}

function setRoom(consultantId){
    let reqData = {
        "member_id": signData["info"]["id"],
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


    fetch("/api/chat", fetchOptions)
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        console.log(result);
    })
}