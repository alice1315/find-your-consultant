var socket;

function connectSocket(){
    socket = io.connect();

    // Register
    let registerId = membership + String(memberId);
    socket.emit("register", {"register_id": registerId})

    socketOn();
}

function socketOn(){
    socket.on("connect", function(){
        console.log("connect");
    })
    socket.on("disconnect", function(){
        console.log("disconnected!");
    })

    // Make notification
    socket.on("notify", function(data){
        let caseId = data["case_id"];
        if (caseId !== windowCaseId){
            showBlock(document.querySelector(`#${caseId}`));
            showBlock(msgNote);
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