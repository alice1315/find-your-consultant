from flask import request, make_response

from . import api_
from .. import res, db, utils
from ..models.auth import Auth

# Get chat list 
@api_.route("/chatlist", methods = ["PATCH"])
def get_chat_list():
    access_token = request.cookies.get("access_token")
    if access_token:
        payload = Auth.decode_auth_token(access_token)
        membership = payload["info"]["membership"]
        id = payload["info"]["id"]

        data = request.get_json()
        status = data["status"]
    
        if membership == "member":
            if status == "doing":
                sql = ("SELECT ca.case_id, ca.consultant_id, ca.field_code, ca.status, c.pic_url, c.name, c.job_title, r.member  FROM `case` ca, consultant c, read_status r WHERE ca.member_id=%s AND ca.consultant_id=c.id AND ca.case_id=r.case_id AND ca.status<>'已結案' ORDER BY ca.id DESC")
            else:
                sql = ("SELECT ca.case_id, ca.consultant_id, ca.field_code, ca.status, c.pic_url, c.name, c.job_title, r.member  FROM `case` ca, consultant c, read_status r WHERE ca.member_id=%s AND ca.consultant_id=c.id AND ca.case_id=r.case_id AND ca.status='已結案' ORDER BY ca.id DESC")
        else:
            if status == "doing":
                sql = ("SELECT ca.case_id, ca.member_id, ca.field_code, ca.status, m.pic_url, m.name, r.consultant  FROM `case` ca, member m, read_status r WHERE ca.consultant_id=%s AND ca.member_id=m.id AND ca.case_id=r.case_id AND ca.status<>'已結案' ORDER BY ca.id DESC")
            else:
                sql = ("SELECT ca.case_id, ca.member_id, ca.field_code, ca.status, m.pic_url, m.name, r.consultant  FROM `case` ca, member m, read_status r WHERE ca.consultant_id=%s AND ca.member_id=m.id AND ca.case_id=r.case_id AND ca.status='已結案' ORDER BY ca.id DESC")
        
        sql_data = (id, )

        result = db.execute_sql(sql, sql_data, "all")

        return res.respond(result)


# Create case and set chatting room
@api_.route("/chat", methods = ["POST"])
def set_room():
    data = request.get_json()

    member_id = data["member_id"]
    consultant_id = data["consultant_id"]
    field_code = data["field_code"]

    # Check if room exists
    sql = ("SELECT count(*) FROM `case` WHERE member_id=%s AND consultant_id=%s AND field_code=%s AND status<>'已結案'")
    sql_data = (member_id, consultant_id, field_code)
    result = db.execute_sql(sql, sql_data, "count")

    if result == 0:
        # Set case id
        sql = ("SELECT count(*) FROM `case` WHERE field_code=%s")
        sql_data = (field_code, )
        result = db.execute_sql(sql, sql_data, "count")

        if result > 0:
            case_id = field_code.upper() + f"{result + 1:05}"
        else:
            case_id = field_code.upper() + f"{1:05}"

        sql = ("INSERT INTO `case` (case_id, member_id, consultant_id, field_code, status) VALUES (%s, %s, %s, %s, '前置諮詢')")
        sql_data = (case_id, member_id, consultant_id, field_code)
        db.execute_sql(sql, sql_data, "one", commit = True)

        sql = ("INSERT INTO read_status (case_id, member, consultant) VALUES (%s, 0, 0)")
        sql_data = (case_id, )
        db.execute_sql(sql, sql_data, "one", commit = True)

        return res.ok()
    else:
        return make_response(res.error("經查詢，您已有諮詢此顧問的紀錄，請直接點選【諮詢聊天室】"), 400)

# Get chat history
@api_.route("/chat", methods = ["PATCH"])
def get_chat_history():
    data = request.get_json()
    
    case_id = data["case_id"]
    
    sql = ("SELECT sender_membership, message, DATE_FORMAT(CONVERT_TZ(time,'+00:00','+8:00'), '%H:%i') AS send_time FROM case_messages WHERE case_id=%s ORDER BY time")
    sql_data = (case_id, )
    results = db.execute_sql(sql, sql_data, "all")

    return res.respond(results)
    