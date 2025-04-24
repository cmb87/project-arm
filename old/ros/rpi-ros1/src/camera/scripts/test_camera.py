import cv2
  
  
# define a video capture object
vid = cv2.VideoCapture(0)
  
while(True):
      
    # Capture the video frame
    # by frame
    ret, frame = vid.read()
  

    if ret:
        print(frame.shape)
    else:
        print("error")

  
# After the loop release the cap object
vid.release()
# Destroy all the windows
