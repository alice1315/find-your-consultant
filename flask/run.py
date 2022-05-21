from app import socketio, create_app

app = create_app()

if __name__ == "__main__":
    # socketio.run(app, debug = True , host = "127.0.0.1", port = "3000")
    socketio.run(app, host = "0.0.0.0", port = "3000")
