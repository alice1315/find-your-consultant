class Response():
    def __init__(self):
        pass

    def ok(self):
        dict = {"ok": True}
        return dict

    def error(self, message):
        dict = {"error": True, "message": message}
        return dict