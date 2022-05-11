from flask import render_template

from . import auth

@auth.route("/signup/member")
def signup_for_member():
    return render_template("signup_member.html")

@auth.route("/signup/consultant")
def signup_for_consultant():
    return render_template("signup_consultant.html")

@auth.route("/signin")
def signin():
    return render_template("signin.html")