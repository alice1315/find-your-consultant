from flask import Blueprint

case = Blueprint("case", __name__, template_folder = "templates")

from . import views, socket