from flask import request
from flask_socketio import send, emit

from .. import socketio
from .. import db

from ..models.auth import Auth


@socketio.on("connect")
def connect():
    access_token = request.cookies.get("access_token")
    if access_token:
        data = Auth.decode_auth_token(access_token)
        membership = data["info"]["membership"]
        id = data["info"]["id"]

        if membership == "member":
            sql = ("UPDATE room SET member_sid=%s WHERE member_id=%s")
        else:
            sql = ("UPDATE room SET consultant_sid=%s WHERE consultant_id=%s")

        sql_data = (request.sid, id)
        db.execute_sql(sql, sql_data, "one", commit = True)


@socketio.on("disconnect")
def disconnect():
    print("disconnect")

@socketio.on("history")
def get_history(payload):
    pass

@socketio.on("send")
def private_messages(payload):
    room_id = payload["room_id"]
    receiver_membership = payload["receiver_membership"]
    receiver_id = payload["receiver_id"]
    message = payload["message"]

    if receiver_membership == "consultant":
        sql = ("SELECT consultant_sid FROM room WHERE id=%s AND consultant_id=%s")
        sql_data = (room_id, receiver_id)
        result = db.execute_sql(sql, sql_data, "one")
        receiver_sid = result["consultant_sid"]
    else:
        sql = ("SELECT member_sid FROM room WHERE id=%s AND member_id=%s")
        sql_data = (room_id, receiver_id)
        result = db.execute_sql(sql, sql_data, "one")
        receiver_sid = result["member_sid"]

    emit("receive", message, room = receiver_sid)



