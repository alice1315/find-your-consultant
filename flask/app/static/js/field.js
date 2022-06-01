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
    await fetch("/api/consultant/"+ fieldCode, {method: "GET"})
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
        let amount = data["amount"]

        setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount);
    })
}

function setProfile(id, picUrl, name, jobTitle, gender, fields, price, agency, ratings, amount){
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

    let roomBtn = createDocElement("button", "btn start", "尋求諮詢");

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
        let s = createDocElement("span", "", convertFieldName(field));
        let i = document.createElement("img");
        divFields.appendChild(f);
        f.appendChild(i);
        f.appendChild(s);
        i.src = "/img/check.png";
    })

    profile.appendChild(profilePro);
    profilePro.appendChild(createDocElement("div", "price", "諮詢時薪： $ " + price + " /元"));
    profilePro.appendChild(createDocElement("div", "agency", "服務機構： " + agency));
    profilePro.appendChild(createDocElement("div", "case", "處理案件數： " + amount + " 件"));
    profilePro.appendChild(createDocElement("div", "feedback", "案件回饋： "));

    profile.appendChild(roomBtn);
    roomBtn.onclick = function(){
        if (signData){
            setRoom(id);
            location.href = "/chat";
        } else{
            location.href = "/signin";
        }
        
    }
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