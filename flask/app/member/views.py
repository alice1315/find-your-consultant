from flask import render_template

from . import member

@member.route("/memberpage")
def member_page():
    return render_template("memberpage.html")
