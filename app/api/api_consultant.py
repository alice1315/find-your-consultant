from flask import request, make_response

from . import api_
from .. import res
from .. import db

# Consultant info
@api_.route("/consultant/<fieldCode>", methods = ["GET"])
def get_consultant_info(fieldCode):
    # Still need star, case and feedback
    sql = ("SELECT pic_url, name, gender, fields, agency, job_title, price FROM consultant WHERE ")

    field_code = fieldCode

    return res.ok()
