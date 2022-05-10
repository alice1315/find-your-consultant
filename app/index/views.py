from flask import render_template

from . import index

@index.route("/")
def index():
    return render_template("index.html")