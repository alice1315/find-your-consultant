from flask import Flask
from flask_socketio import SocketIO

from .models.response import Response
from .models.database import Database
from .models.s3 import S3
from .models.utils import Utils
from .config import MYSQL_CONFIG
from .config import SECRET_KEY

res = Response()
db = Database(MYSQL_CONFIG)
utils = Utils()
s3 = S3()

socketio = SocketIO()

def create_app():
    app = Flask(__name__, static_folder = "static", static_url_path = "/")
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["JSON_AS_ASCII"] = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True

    from app.main import main as main_bp
    from app.auth import auth as auth_bp
    from app.member import member as member_bp
    from app.chat import chat as chat_bp
    from app.api import api_ as api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(member_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(api_bp, url_prefix = "/api")

    socketio.init_app(app)

    return app
