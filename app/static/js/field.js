var fieldData;
var fieldCode;

async function fieldInit(){
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
        let picUrl = data["pic_url"];
        let name = data["name"];
        let jobTitle = data["job_title"];
        let gender = data["gender"];
        let fields = data["fields"];
        let price = data["price"];
        let agency = data["agency"];

        setProfile(picUrl, name, jobTitle, gender, fields, price, agency);
    })
}

function setProfile(picUrl, name, jobTitle, gender, fields, price, agency){
    let profileContainer = document.querySelector(".profile-container");
    let profile = createDocElement("div", "profile");
    let profileBasic = createDocElement("div", "profile-basic");
    let picContainer = createDocElement("div", "img-container");
    let pic = createDocElement("img");

    let divUp= createDocElement("div");
    let star = createDocElement("div", "star");
    let starImg = createDocElement("img");
    let divInfo = createDocElement("div");
    let divFields = createDocElement("div");

    let profilePro = createDocElement("div", "profile-pro");

    profileContainer.appendChild(profile);
    profile.appendChild(profileBasic);
    profileBasic.appendChild(picContainer);
    picContainer.appendChild(pic);
    pic.src = picUrl;

    profileBasic.appendChild(divUp);
    divUp.appendChild(star).appendChild(starImg);
    starImg.src = "/img/p-star.png";
    star.innerHTML += '&nbsp; &nbsp;';

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
    profilePro.appendChild(createDocElement("div", "case", "已處理案件數： " + " 件"));
    profilePro.appendChild(createDocElement("div", "feedback", "案件回饋： "));

    profile.appendChild(createDocElement("button", "btn start", "尋求諮詢"));
}

function createDocElement(element, className, text){
    let e = document.createElement(element);
    if (className){e.setAttribute("class", className);}
    if (text){e.innerText = text;}
    return e
}
