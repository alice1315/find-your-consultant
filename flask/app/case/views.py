from flask import render_template

from . import case

@case.route("/chat")
def set_chatroom():
    return render_template("chat.html")

@case.route("/payment")
def payment():
    return render_template("payment.html")

@case.route("/feedback")
def feedback():
    return render_template("feedback.html")
