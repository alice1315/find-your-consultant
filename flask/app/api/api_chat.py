from flask import request, make_response

from . import api_
from .. import res, db, utils
from ..models.auth import Auth

@api_.route("/chat", methods = ["GET"])
def get_chat_list():
    access_token = request.cookies.get("access_token")
    if access_token:
        data = Auth.decode_auth_token(access_token)
        membership = data["info"]["membership"]
        id = data["info"]["id"]
    
        if membership == "member":
            sql = ("SELECT ca.id, ca.consultant_id, ca.field_code, ca.status, c.pic_url, c.name, c.job_title  FROM `case` ca, consultant c WHERE ca.member_id=%s AND ca.consultant_id=c.id")
        else:
            sql = ("SELECT ca.id, ca.member_id, ca.field_code, ca.status, m.pic_url, m.name  FROM `case` ca, member m WHERE ca.consultant_id=%s AND ca.member_id=m.id")
        
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
    sql = ("SELECT id FROM `case` WHERE member_id=%s AND consultant_id=%s AND field_code=%s AND status<>'結案'")
    result = db.execute_sql(sql, sql_data, "one")

    if not result:
        sql = ("INSERT INTO `case` (member_id, consultant_id, field_code, status) VALUES (%s, %s, %s, '前置諮詢')")
        db.execute_sql(sql, sql_data, "one", commit=True)

        return res.ok()
    else:
        return make_response(res.error("已有諮詢紀錄，請直接點選諮詢聊天室"), 400)

@api_.route("/chat", methods = ["PATCH"])
def get_chat_history():
    data = request.get_json()
    
    case_id = data["case_id"]
    
    sql = ("SELECT sender_membership, message, DATE_FORMAT(time, '%H:%i') AS time FROM case_messages WHERE case_id=%s ORDER BY time")
    sql_data = (case_id, )
    results = db.execute_sql(sql, sql_data, "all")

    return res.respond(results)
    