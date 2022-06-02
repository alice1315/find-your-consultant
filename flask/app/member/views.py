from flask import render_template

from . import member

@member.route("/memberpage/<membership>")
def member_page(membership):
    return render_template("memberpage.html")
