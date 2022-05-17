from flask import jsonify

class Response():
    def __init__(self):
        pass

    def ok(self):
        dict = {"ok": True}
        return jsonify(dict)

    def error(self, message):
        dict = {"error": True, "message": message}
        return jsonify(dict)

    def respond(self, data):
        dict = {"data": data}
        return jsonify(dict)