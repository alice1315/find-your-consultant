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
            sql = ("SELECT email, password, pic_url, name, gender, phone FROM member WHERE id=%s")
            sql_data = (id, )       
            result = db.execute_sql(sql, sql_data, "one")
            return res.respond(result)
        else:
            sql = ("SELECT con.email, con.password, con.pic_url, con.name, con.gender, con.phone, con.fields, con.agency, con.job_title, con.price, COUNT(ca.case_id) AS amount, ROUND(AVG(fe.consultant_rating)) AS ratings FROM consultant con LEFT JOIN `case` ca ON con.id=ca.consultant_id LEFT JOIN feedback fe ON ca.case_id=fe.case_id WHERE con.id=%s")
            sql_data = (id, )       
            result = db.execute_sql(sql, sql_data, "one")

            # Handle field name
            fields = []
            for field_code in result["fields"].split(","):
                field_name = utils.convert_field_name(field_code)
                fields.append(field_name)
            result["fields"] = fields

            # Handle ratings
            if not result["ratings"]:
                result["ratings"] = 0

            # Handle feedback
            sql = ("SELECT fe.case_id, fe.consultant_feedback FROM `case` ca, feedback fe WHERE ca.case_id=fe.case_id AND ca.consultant_id=%s ORDER BY fe.id DESC")
            feedback = db.execute_sql(sql, sql_data, "all")
            result["feedback"] = feedback

            return res.respond(result)
        
    else:
        return make_response(res.error("未登入系統"), 403)
