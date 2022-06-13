from flask import request, make_response
import requests
import json

from . import api_
from .. import res, db
from ..models.auth import Auth
from ..config import TAPPAY_PARTNER_KEY

@api_.route("/payment", methods = ["GET"])
def get_payment_info():
    access_token = request.cookies.get("access_token")
    if access_token:
        membership = Auth.decode_auth_token(access_token)["info"]["membership"]

        if membership == "member":
            case_id = request.args.get("case")
            sql = ("SELECT ca.case_id, f.field_name, con.name, con.job_title, ca.price_per_hour, ca.hours, ca.total_price"
            " FROM `case` ca"
            " LEFT JOIN fields f ON ca.field_code=f.field_code"
            " LEFT JOIN consultant con ON ca.consultant_id=con.id"
            " WHERE ca.case_id=%s")
            sql_data = (case_id, )
            result = db.execute_sql(sql, sql_data, "one")
            
            return res.respond(result)
        else:
            return make_response(res.error("無權限進行此動作"), 403)
    else:
        return make_response(res.error("未登入系統"), 403)


@api_.route("/payment", methods = ["POST"])
def make_payment(): 
    access_token = request.cookies.get("access_token")
    if access_token:
        membership = Auth.decode_auth_token(access_token)["info"]["membership"]

        if membership == "member":
            case_id = request.form["case_id"]
            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"

            headers = {
                    "Content-Type": "application/json",
                    "x-api-key": TAPPAY_PARTNER_KEY
                }

            data = {
                    "prime": request.form["prime"],
                    "partner_key": TAPPAY_PARTNER_KEY,
                    "merchant_id": "vientoa13_CTBC",
                    "details":"Find Your Consultant",
                    "amount": 1,
                    "cardholder": {
                        "phone_number": request.form["phone"],
                        "name": request.form["name"],
                        "email": request.form["email"],
                    },
                    "remember": False
                }

            resp = requests.post(url, data = json.dumps(data), headers = headers)
            payment_result = resp.json()

            y = lambda x: "成功" if x["status"] == 0 else "失敗"

            sql = ("INSERT INTO payment (case_id, status) VALUES (%s, %s)")
            sql_data = (case_id, y(payment_result))
            db.execute_sql(sql, sql_data, "", commit = True)

            if y(payment_result) == "成功":
                sql = ("UPDATE `case` SET status='正式諮詢' WHERE case_id=%s")
                sql_data = (case_id, )
                db.execute_sql(sql, sql_data, "", commit = True)

                return res.ok()
            else: 
                return res.error("付款失敗")

        else:
            return make_response(res.error("無權限進行此動作"), 403)
    else:
        return make_response(res.error("未登入系統"), 403)

