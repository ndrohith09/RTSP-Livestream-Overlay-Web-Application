from flask import Flask, send_from_directory
from flask_cors import CORS
from usb_to_rtsp import stream_usb_to_rtsp
from hls_conversion import start_hls_conversion
import threading, time

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route('/streams/<path:filename>')
def serve_stream(filename):
    return send_from_directory('static/streams', filename)


if __name__ == "__main__":
    # Create Thread objects for your functions
    # We use daemon=True so the threads die when the main program stops
    usb_thread = threading.Thread(target=stream_usb_to_rtsp, daemon=True)
    hls_thread = threading.Thread(target=start_hls_conversion, daemon=True)

    print("Starting USB to RTSP stream...")
    usb_thread.start()
    
    time.sleep(5)

    print("Starting HLS conversion...")
    hls_thread.start()

    app.run(port=5001, debug=True, use_reloader=False)