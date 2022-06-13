from flask_socketio import emit, join_room, leave_room

from .. import socketio
from .. import db

@socketio.on("register")
def register(payload):
    join_room(payload["register_id"])

@socketio.on("join")
def join(payload):
    join_room(payload["case_id"])

@socketio.on("leave")
def leave(payload):
    if payload["case_id"]:
        leave_room(payload["case_id"])

@socketio.on("send")
def send_messages(payload):
    case_id = payload["case_id"]
    membership = payload["membership"]
    message = payload["message"]
    time = payload["time"]

    # Get case info
    sql = ("SELECT member_id, consultant_id FROM `case`WHERE case_id=%s")
    sql_data = (case_id, )
    case_info = db.execute_sql(sql, sql_data, "one")

    if membership == "member":
        receiver_membership = "consultant"
        receiver_id = "consultant" + str(case_info["consultant_id"])
    else:
        receiver_membership = "member"
        receiver_id = "member" + str(case_info["member_id"])

    # Store messages
    sql = ("INSERT INTO case_messages (case_id, sender_membership, message) VALUES (%s, %s, %s)")
    sql_data = (case_id, membership, message)
    db.execute_sql(sql, sql_data, "", commit = True)

    # Send messages to receiver
    receive_data = {"receiver_membership": receiver_membership, "message": message, "time": time}
    emit("receive", receive_data, to = case_id)

    # Notify receiver
    if membership == "member":
        sql = ("UPDATE read_status SET consultant=1 WHERE case_id=%s")
    else:
        sql = ("UPDATE read_status SET member=1 WHERE case_id=%s")

    sql_data = (case_id, )
    db.execute_sql(sql, sql_data, "", commit = True)

    notify_data = {"case_id": case_id}
    emit("notify", notify_data, to = receiver_id)

@socketio.on("read")
def read_messages(payload):
    case_id = payload["case_id"]
    membership = payload["membership"]

    if membership == "member":
        sql = ("UPDATE read_status SET member=0 WHERE case_id=%s")
    else:
        sql = ("UPDATE read_status SET consultant=0 WHERE case_id=%s")

    sql_data = (case_id, )
    db.execute_sql(sql, sql_data, "", commit = True)

@socketio.on("check_unread")
def check_read_status(payload):
    membership = payload["membership"]
    id = payload["id"]

    if membership == "member":
        sql = ("SELECT CAST(SUM(r.member) AS SIGNED) AS unread"
        " FROM `case` ca"
        " LEFT JOIN read_status r ON ca.case_id=r.case_id"
        " WHERE ca.member_id=%s")
    else:
        sql = ("SELECT CAST(SUM(r.consultant) AS SIGNED) AS unread"
        " FROM `case` ca"
        " LEFT JOIN read_status r ON ca.case_id=r.case_id"
        " WHERE ca.consultant_id=%s")

    sql_data = (id, )
    data = db.execute_sql(sql, sql_data, "one")
    register_id = membership + str(id)

    emit("renew_unread", data, to = register_id)

@socketio.on("change_status")
def change_status(payload):
    case_id = payload["case_id"]
    status = payload["status"]

    data = {"status": status}
    emit("renew_status", data ,to = case_id)
