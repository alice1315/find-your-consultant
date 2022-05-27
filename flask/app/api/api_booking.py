from flask import request, make_response

from . import api_
from .. import res, db
from ..models.auth import Auth

@api_.route("/booking", methods = ["POST"])
def make_quotation():
    data = request.get_json()

    case_id = data["case_id"]
    price_per_hour = data["price_per_hour"]
    hours = data["hours"]
    total_price = data["total_price"]

    sql = ("INSERT INTO quotation (case_id, price_per_hour, hours, total_price) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE price_per_hour=%s, hours=%s, total_price=%s")
    sql_data = (case_id, price_per_hour, hours, total_price, price_per_hour, hours, total_price)
    db.execute_sql(sql, sql_data, "one", commit = True)

    return res.ok()