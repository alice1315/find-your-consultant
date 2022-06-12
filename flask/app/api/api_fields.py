from . import api_
from .. import res, db, utils


# Consultants info in field.html
@api_.route("/fields/<fieldCode>", methods = ["GET"])
def get_consultant_info(fieldCode):
    field_code = fieldCode

    sql = ("SELECT con.id, con.pic_url, con.name, con.gender, con.fields, con.agency, con.job_title, con.price, COUNT(ca.case_id) AS amount, ROUND(AVG(fe.consultant_rating)) AS ratings, GROUP_CONCAT(fe.consultant_feedback ORDER BY fe.id DESC SEPARATOR ';%;') AS feedback FROM consultant con LEFT JOIN `case` ca ON con.id=ca.consultant_id LEFT JOIN feedback fe ON ca.case_id=fe.case_id WHERE con.fields LIKE %s GROUP BY con.id")
    sql_data = ("%" + field_code + "%", )
    results = db.execute_sql(sql, sql_data, "all")

    for result in results:
        # Handle field name
        field_list = []
        for field_code in result["fields"].split(","):
            field_name = utils.convert_field_name(field_code)
            field_list.append(field_name)
        result["fields"] = field_list

        # Handle feedback
        feedback_list = []
        if result["feedback"]:
            for feedback in result["feedback"].split(";%;"):
                feedback_list.append(feedback)
            result["feedback"] = feedback_list

    return res.respond(results)
