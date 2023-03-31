import base64
import cv2
import numpy as np

#=====================================
def encode(frame):
    # Send encoded frame back to browser
    retval, buf = cv2.imencode('.png', frame)
    jpg_as_text = base64.b64encode(buf).decode('utf-8')
    return f"data:image/jpeg;base64,{jpg_as_text}"


#=====================================
def decode(base64image):
    # Decode received base64 String
    encoded_data = base64image.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)