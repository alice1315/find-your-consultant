from flask import Flask

from app.index import index as index_bp

def create_app():
    app = Flask(__name__, static_folder = "static", static_url_path = "/")
    app.config["JSON_AS_ASCII"] = False
    app.config["TEMPLATES_AUTO_RELOAD"] = True

    app.register_blueprint(index_bp)

    return app
