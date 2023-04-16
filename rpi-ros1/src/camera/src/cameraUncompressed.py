#!/usr/bin/env python3
"""OpenCV feature detectors with ros CompressedImage Topics in python.

This example subscribes to a ros topic containing sensor_msgs 
CompressedImage. It converts the CompressedImage into a numpy.ndarray, 
then detects and marks features in that image. It finally displays 
and publishes the new image - again as CompressedImage topic.
"""
# Python libs
import sys, time
import numpy as np
import cv2
import roslib
import rospy
from sensor_msgs.msg import Image
from sensor_msgs.msg import CameraInfo

# We do not use cv_bridge it does not support CompressedImage in python
from cv_bridge import CvBridge, CvBridgeError

# https://gist.github.com/Goddard/f5ad1888f11f5f05c7421daccf3623e4


def main():
    '''Initializes and cleanup ros node'''
    rospy.init_node('image_feature', anonymous=True)

    image_pub = rospy.Publisher("/output/image_raw", Image)
    # camera_info_pub = rospy.Publisher("/output/camera_info", CameraInfo)
    time.sleep(3)
    cap = cv2.VideoCapture(0)
    time.sleep(5)
    fps = cap.get(cv2.CAP_PROP_FPS)
   # cap.set(cv2.CAP_PROP_FRAME_WIDTH,1280)
   # cap.set(cv2.CAP_PROP_FRAME_HEIGHT,720)
   # cap.set(cv2.CAP_PROP_FPS, 15)

    rate = rospy.Rate(fps)

    bridge = CvBridge()

    while not rospy.is_shutdown() and cap.grab():

        ret, img = cap.retrieve()

        if not ret:

            print("Could not get frame")

        	
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.flip(img, 0)
        img = cv2.flip(img, 1)
        #### Create CompressedIamge ####
        img_msg = bridge.cv2_to_imgmsg(img, "mono8") # "bgr8"
        img_msg.header.stamp = rospy.Time.now()
        img_msg.header.frame_id = "camera"

        image_pub.publish(img_msg)

        try:
            pass
        except CvBridgeError as e:
            print(e)
        rate.sleep()

    print("Releasing camera")
    cap.release()




if __name__ == '__main__':
    try:
        main()
    except rospy.ROSInterruptException:
        pass