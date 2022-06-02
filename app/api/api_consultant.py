from flask import request, make_response

from . import api_
from .. import res, db, utils


# Consultants info in field.html
@api_.route("/fields/<fieldCode>", methods = ["GET"])
def get_consultant_info(fieldCode):
    field_code = fieldCode

<<<<<<< HEAD:app/api/api_consultant.py
    # Still need star, case and feedback
    sql = ("SELECT pic_url, name, gender, fields, agency, job_title, price FROM consultant WHERE fields LIKE %s")
=======
    # Still need feedback
    sql = ("SELECT con.id, con.pic_url, con.name, con.gender, con.fields, con.agency, con.job_title, con.price, COUNT(ca.id) AS amount, ROUND(AVG(fe.consultant_rating)) AS ratings FROM consultant con LEFT JOIN `case` ca ON con.id=ca.consultant_id LEFT JOIN feedback fe ON ca.id=fe.case_id WHERE con.fields LIKE %s GROUP BY con.id")
>>>>>>> decca66 (Set rendering ratings and case amount.):flask/app/api/api_consultant.py
    sql_data = ("%" + field_code + "%", )
    results = db.execute_sql(sql, sql_data, "all")

    for result in results:
        fields = []
        for field_code in result["fields"].split(","):
            field_name = utils.convert_field_name(field_code)
            fields.append(field_name)
            result["fields"] = fields

        # Handle feedback
        sql = ("SELECT fe.consultant_feedback FROM `case` ca, feedback fe WHERE ca.id=fe.case_id AND ca.consultant_id=%s ORDER BY fe.id DESC")
        sql_data = (result["id"], )
        feedback = db.execute_sql(sql, sql_data, "all")
        result["feedback"] = feedback

    return res.respond(results)
