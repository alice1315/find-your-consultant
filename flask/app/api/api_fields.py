from . import api_
from .. import res, db, utils

# Consultants info in field.html
@api_.route("/fields/<fieldCode>", methods = ["GET"])
def get_consultant_info(fieldCode):
    field_code = fieldCode

    sql = ("SELECT con.id, con.pic_url, con.name, con.gender, GROUP_CONCAT(f.field_name) AS fields, con.agency, con.job_title, con.price,"
    " COUNT(ca.case_id) AS amount, ROUND(AVG(fe.consultant_rating)) AS ratings, GROUP_CONCAT(fe.consultant_feedback ORDER BY fe.time DESC SEPARATOR ';%;') AS feedback"
    " FROM consultant con"
    " LEFT JOIN consultant_fields cf ON con.id=cf.consultant_id"
    " LEFT JOIN fields f ON f.field_code=cf.field_code"
    " LEFT JOIN `case` ca ON con.id=ca.consultant_id"
    " LEFT JOIN feedback fe ON ca.case_id=fe.case_id"
    " GROUP BY con.id HAVING FIND_IN_SET(%s, fields) > 0")

    sql_data = (utils.convert_field_name(field_code), )
    results = db.execute_sql(sql, sql_data, "all")

    for result in results:
        # Handle field
        field_list = []
        for field in result["fields"].split(","):
            field_list.append(field)
        result["fields"] = field_list

        # Handle feedback
        feedback_list = []
        if result["feedback"]:
            for feedback in result["feedback"].split(";%;"):
                feedback_list.append(feedback)
            result["feedback"] = feedback_list

    return res.respond(results)
