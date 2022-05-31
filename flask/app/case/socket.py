from flask_socketio import send, emit, join_room, leave_room

from .. import socketio
from .. import db


@socketio.on("connect")
def connect():
    print("connect")

@socketio.on("disconnect")
def disconnect():
    print("disconnect")

@socketio.on("join")
def join(payload):
    case_id = payload["case_id"]
    join_room(case_id)

@socketio.on("leave")
def leave(payload):
    if payload["case_id"]:
        case_id = payload["case_id"]
        leave_room(case_id)

@socketio.on("send")
def send_messages(payload):
    case_id = payload["case_id"]
    membership = payload["membership"]
    message = payload["message"]

    if membership == "member":
        receiver_membership = "consultant"
    else:
        receiver_membership = "member"

    data = {"receiver_membership": receiver_membership, "message": message}

    emit("receive", data, to = case_id)

    # Store messages
    sql = ("INSERT INTO case_messages (case_id, sender_membership, message) VALUES (%s, %s, %s)")
    sql_data = (case_id, membership, message)
    db.execute_sql(sql, sql_data, "one", commit = True)
