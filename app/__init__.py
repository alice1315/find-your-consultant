from flask import Flask

from .models.response import Response
from .models.database import Database
from .config import MYSQL_CONFIG

res = Response()
db = Database(MYSQL_CONFIG)

def create_app():
    app = Flask(__name__, static_folder = "static", static_url_path = "/")
    app.config["JSON_AS_ASCII"] = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True

    from app.main import main as main_bp
    from app.auth import auth as auth_bp
    from app.api import api_ as api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp, url_prefix = "/api")

    return app
