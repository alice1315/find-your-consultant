from flask import request, make_response

from . import api_
from .. import res, db, utils
from ..models.auth import Auth

@api_.route("/memberpage", methods = ["GET"])
def show_memberpage():
    access_token = request.cookies.get("access_token")
    if access_token:
        payload = Auth.decode_auth_token(access_token)
        membership = payload["info"]["membership"]
        id = payload["info"]["id"]

        if membership == "member":
            sql = ("SELECT email, pic_url, name, gender, phone FROM member WHERE id=%s")
            sql_data = (id, )       
            result = db.execute_sql(sql, sql_data, "one")
            return res.respond(result)
            
        else:
            sql = ("SELECT con.email, con.pic_url, con.name, con.gender, con.phone, GROUP_CONCAT(f.field_name) AS fields, con.agency, con.job_title, con.price,"
            " t.amount, t.ratings, t.feedback"
            " FROM consultant con"
            " LEFT JOIN consultant_fields cf ON con.id=cf.consultant_id"
            " LEFT JOIN fields f ON f.field_code=cf.field_code"
            " LEFT JOIN(SELECT ca.consultant_id AS id, COUNT(ca.case_id) AS amount, ROUND(AVG(fe.consultant_rating)) AS ratings, GROUP_CONCAT(CONCAT(fe.case_id, '&&&', fe.consultant_feedback) ORDER BY fe.time DESC SEPARATOR ';%;') AS feedback"
            " FROM `case` ca"
            " LEFT JOIN feedback fe ON ca.case_id=fe.case_id"
            " GROUP BY id) t"
            " ON con.id=t.id"
            " GROUP BY con.id HAVING con.id=%s")

            sql_data = (id, )       
            result = db.execute_sql(sql, sql_data, "one")

            # Handle ratings
            if not result["ratings"]:
                result["ratings"] = 0

            # Handle feedback
            feedback_list = []
            if result["feedback"]:
                for feedback in result["feedback"].split(";%;"):
                    [case_id, feedback_message] = feedback.split("&&&", 1)
                    feedback_list.append([case_id, feedback_message])
                result["feedback"] = feedback_list

            return res.respond(result)
        
    else:
        return make_response(res.error("未登入系統"), 403)
