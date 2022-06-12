from flask import jsonify

class Response():
    def __init__(self):
        pass

    @staticmethod
    def ok():
        dict = {"ok": True}
        return jsonify(dict)

    @staticmethod
    def error(message):
        dict = {"error": True, "message": message}
        return jsonify(dict)

    @staticmethod
    def respond(data):
        dict = {"data": data}
        return jsonify(dict)