from flask import Flask

from .models.response import Response
from .models.database import Database
from .models.utils import Utils
from .config import MYSQL_CONFIG

res = Response()
db = Database(MYSQL_CONFIG)
utils = Utils()

def create_app():
    app = Flask(__name__, static_folder = "static", static_url_path = "/")
    app.config["JSON_AS_ASCII"] = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True

    from app.main import main as main_bp
    from app.auth import auth as auth_bp
<<<<<<< HEAD:app/__init__.py
=======
    from app.member import member as member_bp
    from app.case import case as case_bp
>>>>>>> 277f56c (Set function of ending case.):flask/app/__init__.py
    from app.api import api_ as api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
<<<<<<< HEAD:app/__init__.py
=======
    app.register_blueprint(member_bp)
    app.register_blueprint(case_bp)
>>>>>>> 277f56c (Set function of ending case.):flask/app/__init__.py
    app.register_blueprint(api_bp, url_prefix = "/api")

<<<<<<< HEAD:app/__init__.py
<<<<<<< HEAD:app/__init__.py
<<<<<<< HEAD:app/__init__.py
<<<<<<< HEAD:app/__init__.py
<<<<<<< HEAD:app/__init__.py
=======
    socketio.init_app(app, cors_allowed_origins="*")
=======
    socketio.init_app(app, async_mode = "eventlet", cors_allowed_origins="*")
>>>>>>> 15e692d (Test socket.):flask/app/__init__.py
=======
    socketio.init_app(app, async_mode = "eventlet", cors_allowed_origins = "*")
>>>>>>> f27d836 (Test internet.):flask/app/__init__.py
=======
    socketio.init_app(app, async_mode = "eventlet", cors_allowed_origins = "*", logger=True, engineio_logger=True)
>>>>>>> 92c0cdd (Added function of notification.):flask/app/__init__.py
=======
    # socketio.init_app(app, async_mode = "eventlet", cors_allowed_origins = "*", logger=True, engineio_logger=True)
    socketio.init_app(app, cors_allowed_origins = "*")
>>>>>>> a0d8e92 (Modified function of notification and socket.):flask/app/__init__.py

>>>>>>> 2b6a85a (Test sodkcet 2.):flask/app/__init__.py
    return app
