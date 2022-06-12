var socket;
var windowCaseId = "";

function connectSocket(){
    socket = io.connect();

    // Register
    let registerId = membership + String(memberId);
    socket.emit("register", {"register_id": registerId})

    socketOn();
}

function socketOn(){
    // Make notification
    socket.on("notify", function(data){
        let caseId = data["case_id"];

        if (caseId !== windowCaseId){
            if (document.querySelector(`#${caseId}`)){
                showBlock(document.querySelector(`#${caseId}`));
            }
            showBlock(msgNote);

        } else{
            socket.emit("read", {"case_id": caseId, "membership": membership})
        }
    })

    // Renew unread
    socket.on("renew_unread", function(data){
        let unread = data["unread"];
        if (unread > 0){
            showBlock(msgNote);
        } else if (unread == 0){
            hideBlock(msgNote);
        }
    })
}