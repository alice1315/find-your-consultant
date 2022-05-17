from flask import request, make_response

from . import api_
from .. import res, db, utils


# Consultant info
@api_.route("/consultant/<fieldCode>", methods = ["GET"])
def get_consultant_info(fieldCode):
    field_code = fieldCode

    # Still need star, case and feedback
    sql = ("SELECT pic_url, name, gender, fields, agency, job_title, price FROM consultant WHERE fields LIKE %s")
    sql_data = ("%" + field_code + "%", )
    results = db.execute_sql(sql, sql_data, "all")

    for result in results:
        result["fields"] = result["fields"].split(",")

    return res.respond(results)
