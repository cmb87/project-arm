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
from sensor_msgs.msg import CompressedImage
# We do not use cv_bridge it does not support CompressedImage in python
# from cv_bridge import CvBridge, CvBridgeError

# https://gist.github.com/Goddard/f5ad1888f11f5f05c7421daccf3623e4


def main():
    '''Initializes and cleanup ros node'''
    rospy.init_node('image_feature', anonymous=True)

    image_pub = rospy.Publisher("/output/image_raw/compressed", CompressedImage)
    cap = cv2.VideoCapture(0)
    fps = cap.get(cv2.CAP_PROP_FPS)

    rate = rospy.Rate(fps)

    while not rospy.is_shutdown() and cap.grab():

        ret, img = cap.retrieve()

        if not ret:
            print("Could not get frame")

        #### Create CompressedIamge ####
        try:
            msg = CompressedImage()
            msg.header.stamp = rospy.Time.now()
            msg.format = "jpeg"
            msg.data = np.array(cv2.imencode('.jpg', img)[1]).tostring()
            # Publish new image
            image_pub.publish(msg)
        except Exception as e:
            print(e)
        rate.sleep()
    return




if __name__ == '__main__':
    try:
        main()
    except rospy.ROSInterruptException:
        pass