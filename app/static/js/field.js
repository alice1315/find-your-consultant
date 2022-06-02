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
        let picUrl = data["pic_url"];
        let name = data["name"];
        let jobTitle = data["job_title"];
        let gender = data["gender"];
        let fields = data["fields"];
        let price = data["price"];
        let agency = data["agency"];

<<<<<<< HEAD:app/static/js/field.js
        setProfile(picUrl, name, jobTitle, gender, fields, price, agency);
    })
}

function setProfile(picUrl, name, jobTitle, gender, fields, price, agency){
=======
        let ratings = data["ratings"];
        let amount = data["amount"];
        let feedback = data["feedback"];

        setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount, feedback);
    })
}

<<<<<<< HEAD:app/static/js/field.js
function setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount){
>>>>>>> decca66 (Set rendering ratings and case amount.):flask/app/static/js/field.js
=======
function setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount, feedback){
>>>>>>> a62b72a (Set feedback in field.html.):flask/app/static/js/field.js
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

    profile.appendChild(profilePro);
    profilePro.appendChild(createDocElement("div", "price", `諮詢時薪： $ ${price} /元`));
    profilePro.appendChild(createDocElement("div", "agency", `服務機構： ${agency}`));
    profilePro.appendChild(createDocElement("div", "case", `處理案件數： ${amount} 件`));
    profilePro.appendChild(feedbackBlock);
    feedbackBlock.appendChild(feedbackContainer);

    if (feedback.length > 0){
        for (i = 0; i < feedback.length; i ++){
            feedbackContainer.appendChild(createDocElement("div", "feedback-content", " - " + feedback[i]["consultant_feedback"]));
        }
        feedbackContainer.appendChild(createDocElement("div", "feedback-more", "more"));
    } else{
        feedbackContainer.appendChild(createDocElement("div", "feedback-content", "暫無回饋"));
    }
    

<<<<<<< HEAD:app/static/js/field.js
    profile.appendChild(createDocElement("button", "btn start", "尋求諮詢"));
=======
    profile.appendChild(roomBtn);
    roomBtn.onclick = function(){
        if (signData){
            setRoom(id);
            location.href = "/chat";
        } else{
            location.href = "/signin";
        }
        
    }
>>>>>>> ae30268 (Modified route when not signed in.):flask/app/static/js/field.js
}

function createDocElement(element, className, text){
    let e = document.createElement(element);
    if (className){e.setAttribute("class", className);}
    if (text){e.innerText = text;}
    return e
}
