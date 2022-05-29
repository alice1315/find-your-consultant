from flask import request, make_response

from . import api_
from .. import res, db
from ..models.auth import Auth

@api_.route("/booking", methods = ["POST"])
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

            sql = ("UPDATE `case` SET price_per_hour=%s, hours=%s, total_price=%s WHERE id=%s")
            sql_data = (price_per_hour, hours, total_price, case_id)
            db.execute_sql(sql, sql_data, "one", commit = True)

            return res.ok()
        else:
            return make_response(res.error("無權限進行此動作"), 403)
    else:
        return make_response(res.error("未登入系統"), 403)