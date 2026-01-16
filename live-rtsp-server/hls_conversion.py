import subprocess
import os
from dotenv import load_dotenv
load_dotenv()  

RTSP_SERVER = os.getenv("RTSP_SERVER")
STREAM_DIR = os.getenv("STREAM_DIR")

# Directory to store the web-ready video chunks
os.makedirs(STREAM_DIR, exist_ok=True)

def start_hls_conversion():
    rtsp_url = RTSP_SERVER
    output_path = os.path.join(STREAM_DIR, "index.m3u8")

    command = [
        'ffmpeg',
        '-fflags', 'nobuffer',      # Reduce input buffer
    '-flags', 'low_delay',      # Optimize for low delay
        '-i', rtsp_url,           # Input from your USB RTSP stream
        '-c:v', 'libx264',        # Convert to H.264 (Web compatible)
        '-preset', 'ultrafast',   # Minimal delay
        '-tune', 'zerolatency',
        '-c:a', 'aac',            # Audio codec
        '-f', 'hls',              # Output as HLS
        '-hls_time', '1',         # 2-second segments
        '-hls_list_size', '3',    # Keep only the last 3 segments
        '-hls_flags', 'delete_segments',
        output_path
    ]

    # Start the conversion in the background
    return subprocess.Popen(command)
