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

        # Select feedback
        sql = ("SELECT fe.consultant_feedback FROM `case` ca, feedback fe WHERE ca.id=fe.case_id AND ca.consultant_id=%s ORDER BY fe.id DESC")
        sql_data = (result["id"], )
        feedback = db.execute_sql(sql, sql_data, "all")
        result["feedback"] = feedback

    return res.respond(results)
