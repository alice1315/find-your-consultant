from flask import request, make_response

from . import api_
from .. import res, db
from ..models.auth import Auth

# Get current status of case
@api_.route("/status", methods = ["PATCH"])
def get_status():
    access_token = request.cookies.get("access_token")
    if access_token:
        data = request.get_json()
        case_id = data["case_id"]

        sql = ("SELECT status FROM `case` WHERE id=%s")
        sql_data = (case_id, )
        result = db.execute_sql(sql, sql_data, "one")

        return res.respond(result)

    else:
        return make_response(res.error("未登入系統"), 403)

# Make quotation (for consultant)
@api_.route("/quotation", methods = ["POST"])
def make_quotation():
    access_token = request.cookies.get("access_token")
    if access_token:
        membership = Auth.decode_auth_token(access_token)["info"]["membership"]
        if membership == "consultant":
            data = request.get_json()

            case_id = data["case_id"]
            price_per_hour = data["price_per_hour"]
            hours = data["hours"]
            total_price = data["total_price"]

            sql = ("UPDATE `case` SET status='提出報價', price_per_hour=%s, hours=%s, total_price=%s WHERE id=%s")
            sql_data = (price_per_hour, hours, total_price, case_id)
            db.execute_sql(sql, sql_data, "one", commit = True)

            return res.ok()
        else:
            return make_response(res.error("無權限進行此動作"), 403)
    else:
        return make_response(res.error("未登入系統"), 403)

# Request to end case (for consultant)
@api_.route("/endcase", methods = ["PATCH"])
def request_to_end_case():
    access_token = request.cookies.get("access_token")
    if access_token:
        membership = Auth.decode_auth_token(access_token)["info"]["membership"]
        if membership == "consultant":
            data = request.get_json()
            case_id = data["case_id"]

            sql = ("UPDATE `case` SET status='提出結案' WHERE id=%s")
            sql_data = (case_id, )
            db.execute_sql(sql, sql_data, "one", commit = True)

            return res.ok()
            
        else:
            return make_response(res.error("無權限進行此動作"), 403)
    else:
        return make_response(res.error("未登入系統"), 403)

# Agree end case and send feedback (for member)
@api_.route("/feedback", methods = ["POST"])
def send_feedback():
    access_token = request.cookies.get("access_token")
    if access_token:
        membership = Auth.decode_auth_token(access_token)["info"]["membership"]
        if membership == "member":
            case_id = request.form["case_id"]     
            rating = request.form["rating"]
            consultant_feedback = request.form["consultant_feedback"]
            platform_feedback = request.form["platform_feedback"]

            sql = ("INSERT INTO feedback (case_id, consultant_rating, consultant_feedback, platform_feedback) VALUES (%s, %s, %s, %s)")
            sql_data = (case_id, rating, consultant_feedback, platform_feedback)
            db.execute_sql(sql, sql_data, "one", commit = True)

            sql = ("UPDATE `case` SET status='已結案' WHERE id=%s")
            sql_data = (case_id, )
            db.execute_sql(sql, sql_data, "one", commit = True)
            
            return res.ok()

        else:
            return make_response(res.error("無權限進行此動作"), 403)
    else:
        return make_response(res.error("未登入系統"), 403)