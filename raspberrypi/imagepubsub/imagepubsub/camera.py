import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from cv_bridge import CvBridge, CvBridgeError
import sys
import numpy as np
import cv2
import os
import threading




# =====================================
class MinimalPublisher(Node):

    def __init__(self, timer_period=0.5):
        super().__init__(node_name='drift_node')

        self.declare_parameter("pubtopic", "topic")
        self.declare_parameter("width", 400)
        self.declare_parameter("height", 300)

        self.declare_parameter("cameradev", 0)
        self.declare_parameter("rgb", True)

        self.get_logger().info('Publishing to topic: "%s"' % self.get_parameter('pubtopic').value)
        self.publisher = self.create_publisher(
            Image,
            self.get_parameter('pubtopic').value,
            10
        )

        self.width, self.height = self.get_parameter('width').value, self.get_parameter('height').value,

        # Create the cv_bridge object
        self.bridge = CvBridge()

        # Peridically publish images
        self.ros_thread = threading.Thread(target=self.publish, daemon=True)
        self.ros_thread.start()

    # =====================================
    def publish(self):
        # Use cv_bridge() to convert the ROS image to OpenCV format
        self.get_logger().info('Starting camera thread...')

        try:
            dev = int(self.get_parameter('cameradev').value)
        except:
            dev = self.get_parameter('cameradev').value

        cap = cv2.VideoCapture(dev)

        while True:
            # Capture frame-by-frame
            ret, frame = cap.read()
            #If the last frame is reached, reset the capture and the frame_counter
            if ret:
                self.get_logger().info('Publishing...')
                # Publish it using roscv bridge

                if self.get_parameter('rgb').value:
                    self.publisher.publish(self.bridge.cv2_to_imgmsg(cv2.resize(frame,(self.width, self.height)), "bgr8"))
                else:
                    frame = cv2.cvtColor(cv2.resize(frame,(self.width, self.height)), cv2.COLOR_BGR2GRAY)
                    self.depthcamPub.publish(self.bridge.cv2_to_imgmsg(frame, "mono8"))
            else:
               cap.set(cv2.CAP_PROP_POS_FRAMES, 0)


# =====================================
def main(args=None):
    rclpy.init(args=args)

    pub = MinimalPublisher()
    rclpy.spin(pub)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    pub.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()