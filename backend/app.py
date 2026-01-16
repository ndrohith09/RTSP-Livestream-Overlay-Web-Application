from flask import Flask
from flask_cors import CORS
from database import client
from routes.overlays import overlays_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.register_blueprint(overlays_bp, url_prefix="/api/overlays")

@app.route("/")
def health():
    try:
        client.rstp.command("ping")
        return {"mongodb": "connected", "status": "RTSP Overlay Backend Running"}
    except Exception as e:
        return {"mongodb": "error", "message": str(e)}, 500


if __name__ == "__main__":
    app.run(debug=True)
