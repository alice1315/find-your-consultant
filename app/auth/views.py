from flask import render_template

from . import auth

@auth.route("/signup/<membership>")
def signup(membership):
    return render_template("signup.html")

@auth.route("/signin")
def signin():
    return render_template("signin.html")