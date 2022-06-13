var memberData;

async function memberInit(){
    await baseInit();
    if (signData){
        await initMemberData();
    } else{
        location.href = "/";
    }
    renderMemberPage();
    endLoading();
}

async function initMemberData(){
    await fetch("/api/memberpage", {method: "GET"})
    .then((resp) => {
        return resp.json();
    }).then((result) => {
        memberData = result["data"];
    })
}

function renderMemberPage(){
    document.querySelector("#pic-url").src = memberData["pic_url"];
    document.querySelector("#membership").innerText = convertMembership(membership);
    document.querySelector("#email").innerText = memberData["email"];
    document.querySelector("#name").innerText = memberData["name"];
    document.querySelector("#gender").innerText = memberData["gender"];
    document.querySelector("#phone").innerText = memberData["phone"];

    if (membership === "consultant"){
        showBlock(document.querySelector(".consultant-pro"));
        document.querySelector("#fields").innerText = memberData["fields"];
        document.querySelector("#agency").innerText = memberData["agency"];
        document.querySelector("#job-title").innerText = memberData["job_title"];
        document.querySelector("#price").innerText = `$ ${memberData["price"]} 元 /時`;
        if ( !memberData["amount"]){
            document.querySelector("#amount").innerText = `0 件`;
        } else{
            document.querySelector("#amount").innerText = `${memberData["amount"]} 件`;
        }
        document.querySelector("#ratings").innerText = `${memberData["ratings"]} 分`;

        if (memberData["feedback"] && memberData["feedback"].length > 0){
            memberData["feedback"].forEach(function(e){
                renderFeedback(e[0], e[1]);
            })
        } else{
            document.querySelector("#case-container").appendChild(createDocElement("div", "case", "暫無回饋紀錄"));
        }
    }   
}

function renderFeedback(caseId, feedbackContent){
    let caseCon = createDocElement("div", "case");
    document.querySelector("#case-container").appendChild(caseCon);
    caseCon.appendChild(createDocElement("div", "case-id", caseId));
    caseCon.appendChild(createDocElement("div", "feedback", feedbackContent));
}