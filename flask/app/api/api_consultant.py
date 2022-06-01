from flask import request, make_response

from . import api_
from .. import res, db, utils


# Consultant info
@api_.route("/consultant/<fieldCode>", methods = ["GET"])
def get_consultant_info(fieldCode):
    field_code = fieldCode

    # Still need feedback
    sql = ("SELECT con.id, con.pic_url, con.name, con.gender, con.fields, con.agency, con.job_title, con.price, COUNT(ca.id) AS amount, ROUND(AVG(fe.consultant_rating)) AS ratings FROM consultant con LEFT JOIN `case` ca ON con.id=ca.consultant_id LEFT JOIN feedback fe ON ca.id=fe.case_id WHERE con.fields LIKE %s GROUP BY con.id")
    sql_data = ("%" + field_code + "%", )
    results = db.execute_sql(sql, sql_data, "all")

    for result in results:
        result["fields"] = result["fields"].split(",")

    return res.respond(results)
