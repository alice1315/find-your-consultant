from flask import request, make_response

from . import api_
from .. import res, db, utils
from ..models.auth import Auth

@api_.route("/chat", methods = ["GET"])
def get_room_list():
    access_token = request.cookies.get("access_token")
    if access_token:
        data = Auth.decode_auth_token(access_token)
        membership = data["info"]["membership"]
        id = data["info"]["id"]
    
        if membership == "member":
            sql = ("SELECT r.id, r.consultant_id, r.field_code, c.pic_url, c.name, c.job_title  FROM room r, consultant c WHERE r.member_id=%s AND r.consultant_id=c.id")
        else:
            sql = ("SELECT r.id, r.member_id, r.field_code, m.pic_url, m.name  FROM room r, member m WHERE r.consultant_id=%s AND r.member_id=m.id")
        
        sql_data = (id, )

        result = db.execute_sql(sql, sql_data, "all")

        return res.respond(result)


@api_.route("/chat", methods = ["POST"])
def set_room():
    data = request.get_json()

    member_id = data["member_id"]
    consultant_id = data["consultant_id"]
    field_code = data["field_code"]

    sql_data = (member_id, consultant_id, field_code)

    # Check if room exists
    sql = ("SELECT id FROM room WHERE member_id=%s and consultant_id=%s and field_code=%s")
    result = db.execute_sql(sql, sql_data, "one")

    if not result:
        sql = ("INSERT INTO room (member_id, consultant_id, field_code) VALUES (%s, %s, %s)")
        db.execute_sql(sql, sql_data, "one", commit=True)

        return res.ok()
    else:
        return make_response(res.error("已有諮詢紀錄，請直接點選諮詢聊天室"), 400)

@api_.route("chat", methods = ["PATCH"])
def get_chat_history():
    data = request.get_json()

    room_id = data["room_id"]
    
    sql = ("SELECT sender_membership, messages FROM messages WHERE room_id=%s ORDER BY time")
    sql_data = (room_id, )
    results = db.execute_sql(sql, sql_data, "all")

    return res.respond(results)
    