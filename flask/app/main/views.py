from flask import render_template

from . import main

@main.route("/")
def index():
    return render_template("index.html")

@main.route("/field/<code>")
def field(code):
    return render_template("field.html")