from flask import request, make_response, jsonify

from . import api_
from .. import res
from .. import db

# Sign In
@api_.route("/auth", methods = ["GET"])
def sign_in():
    return "api: sign_in"

# Sign Up
@api_.route("/auth", methods = ["POST"])
def sign_up():
    email = request.form["email"]
    password = request.form["password"]
    name = request.form["name"]
    gender = request.form["gender"]
    phone = request.form["phone"]
    pic = request.files["pic"]
    pic_name = pic.filename

    form_list = [email, password, name, gender, phone, pic_name]

    if not all(form_list):
        return make_response(jsonify(res.error("請輸入註冊資訊")), 400)

    else:
        sql = ("SELECT id FROM member WHERE email=%s")
        sql_data = (email, )
        result = db.execute_sql(sql, sql_data, "one")

        if result:
            return make_response(jsonify(res.error("Email 已經註冊帳戶")), 400)

        else:
            sql = ("INSERT INTO member (email, password, pic_url, name, gender, phone) VALUES (%s, %s, %s, %s, %s, %s)")
            sql_data = (email, password, pic_name, name, gender, phone)
            db.execute_sql(sql, sql_data, "one", commit=True)

            return jsonify(res.ok())


@api_.app_errorhandler(500)
def handle_500(err):
    return make_response(jsonify(res.error("Internal server error")), 500)