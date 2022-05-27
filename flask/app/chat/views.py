from flask import render_template

from . import chat

@chat.route("/chat")
def set_chatroom():
    return render_template("chat.html")

@chat.route("/payment")
def payment():
    return render_template("payment.html")
