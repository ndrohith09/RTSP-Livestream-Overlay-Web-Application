import cv2, os
import subprocess
from dotenv import load_dotenv
load_dotenv()  

RTSP_SERVER = os.getenv("RTSP_SERVER")

def stream_usb_to_rtsp(camera_index=0, rtsp_url=RTSP_SERVER):
    # Initialize USB Camera
    cap = cv2.VideoCapture(camera_index)
    
    # Get camera properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30

    # Define FFmpeg command for streaming
    # We use 'rawvideo' format to pipe frames from OpenCV to FFmpeg
    command = [
        'ffmpeg',
        '-y', 
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-pix_fmt', 'bgr24',       # OpenCV uses BGR format
        '-s', f"{width}x{height}", # Resolution
        '-r', str(fps),            # Framerate
        '-i', '-',                 # Read from stdin (the pipe)
        '-c:v', 'libx264',         # Encode to H.264
        '-pix_fmt', 'yuv420p',
        '-preset', 'ultrafast',
        '-f', 'rtsp', 
        rtsp_url
    ]

    #Start FFmpeg process
    process = subprocess.Popen(command, stdin=subprocess.PIPE)

    print(f"Streaming USB Camera to {rtsp_url}...")
    print("Press 'q' in the OpenCV window to stop.")

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Write the raw frame to FFmpeg's stdin
            process.stdin.write(frame.tobytes())

            cv2.imshow('USB Cam Streamer', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cap.release()
        process.stdin.close()
        process.terminate()
        cv2.destroyAllWindows()
