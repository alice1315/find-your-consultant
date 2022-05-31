from flask import Blueprint

api_ = Blueprint("api", __name__)

from . import api_auth, api_chat_functions, api_consultant, api_chat, api_payment