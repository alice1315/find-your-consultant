from flask import request, make_response

from . import api_
from .. import res, db, utils
from ..models.auth import Auth

@api_.route("/auth", methods = ["GET"])
def auth():
    return "api: auth"

# Sign In
@api_.route("/auth", methods = ["PATCH"])
def sign_in():
    membership = request.form["membership"]
    email = request.form["email"]
    password = request.form["password"]

    if (not email or not password):
        return make_response(res.error("請輸入登入資訊"), 400)

    else:
        if membership == "consultant":
            sql = ("SELECT id, name, email, password FROM consultant WHERE email=%s")

        elif membership == "member":
            sql = ("SELECT id, name, email, password FROM member WHERE email=%s")

        sql_data = (email, )
        result = db.execute_sql(sql, sql_data, "one")

        if not result:
            return make_response(res.error("此Email尚未註冊"), 400)
        else:
            if password == result["password"]:
                result["membership"] = membership
                auth_token = Auth.encode_auth_token(result["membership"], result["id"], result["name"], result["email"])
                response = make_response(res.ok())
                response.set_cookie("access_token", auth_token)
                return response
            else:
                return make_response(res.error("密碼輸入錯誤"), 400)


# Sign Up
@api_.route("/auth", methods = ["POST"])
def sign_up():
    membership = request.form["membership"]
    email = request.form["email"]
    password = request.form["password"]
    name = request.form["name"]
    gender = utils.convert_gender(request.form["gender"])
    phone = request.form["phone"]
    pic = request.files["pic"]
    pic_name = pic.filename

    form_list = [membership, email, password, name, gender, phone, pic_name]

    # Check membership
    if membership == "consultant":
        fields = request.form["fields"]
        cert = request.files["certificate"]
        cert_name = cert.filename
        agency = request.form["agency"]
        job_title = request.form["job-title"]
        price = request.form["price"]

        form_list.extend([fields, cert_name, agency, job_title, price])

        check_sql = ("SELECT id FROM consultant WHERE email=%s")

    elif membership == "member":
        check_sql = ("SELECT id FROM member WHERE email=%s")

    # Check if data missing
    if not all(form_list):
        return make_response(res.error("請輸入註冊資訊"), 400)

    # Check if signed up before
    else:
        sql_data = (email,)
        result = db.execute_sql(check_sql, sql_data, "one")

        if result:
            return make_response(res.error("Email 已經註冊帳戶"), 400)

        elif membership == "member":
            sql = ("INSERT INTO member (email, password, pic_url, name, gender, phone) VALUES (%s, %s, %s, %s, %s, %s)")
            sql_data = (email, password, pic_name, name, gender, phone)
            db.execute_sql(sql, sql_data, "one", commit=True)

            return res.ok()

        elif membership == "consultant":
            sql = ("INSERT INTO consultant (email, password, pic_url, name, gender, phone, fields, certificate_url, agency, job_title, price) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            sql_data = (email, password, pic_name, name, gender, phone, fields, cert_name, agency, job_title, price)
            db.execute_sql(sql, sql_data, "one", commit=True)

            return res.ok()


@api_.app_errorhandler(500)
def handle_500(err):
    return make_response(res.error("Internal server error"), 500)