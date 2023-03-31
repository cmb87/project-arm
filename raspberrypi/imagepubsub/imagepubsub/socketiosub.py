import rclpy
import time
import logging
import socketio
import logging
import base64
import cv2
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from cv_bridge import CvBridge, CvBridgeError

from .encoding import encode

# =====================================
# Set logging formats
logging.basicConfig(
    level=logging.INFO,
    format=("[%(filename)8s] [%(levelname)4s] :  %(funcName)s - %(message)s"),
)

# =====================================
# standard Python
sio = socketio.Client()

# =====================================
class SocketIOSub(Node):

    def __init__(self):
        super().__init__('SocketIOPubSub')

        # Parameters
        self.declare_parameter("socketioserver", "localhost")
        self.declare_parameter("socketioport", 5000)
        self.declare_parameter("socketionamespace", "cv")
        self.declare_parameter("socketiotopic", "ros2server")

        self.declare_parameter("imagetopic", "imagetopic")

        self.socketioServer = self.get_parameter('socketioserver').value
        self.socketioPort = self.get_parameter('socketioport').value
        self.socketioNS = self.get_parameter('socketionamespace').value


        self.get_logger().info('Subscribing to topic: "%s"' % self.get_parameter('imagetopic').value)

        # Create subscriber
        self.subscription = self.create_subscription(
            Image,
            self.get_parameter('imagetopic').value,
            self.listener_callback,
            10
        )

        # prevent unused variable warning
        self.subscription

        # Create the cv_bridge object
        self.bridge = CvBridge()


    # =====================================
    def listener_callback(self, ros_image):
        # Use cv_bridge() to convert the ROS image to OpenCV format
        try:
            frame = self.bridge.imgmsg_to_cv2(ros_image, "bgr8")
        except CvBridgeError:
            self.get_logger().info('CvBridge error encountered')
            frame = None

        # Emitting to socketio
        sio.emit(
            self.get_parameter('socketiotopic').value,
            {'frame': encode(frame) }
        )

        self.get_logger().info('Image Received')




# =====================================
def main(args=None):
    rclpy.init(args=args)

    sub = SocketIOSub()

    @sio.event
    def connect():
        logging.info('Successfully connected to server.')

    @sio.event
    def connect_error():
        logging.info('Failed to connect to server.')

    @sio.event
    def disconnect():
        logging.info('Disconnected from server.')

    # Connect to socketio
    while True:
        try:
            sio.connect(f"ws://{sub.socketioServer}:{sub.socketioPort}", namespaces=[sub.socketioNS])
            break
        except:
            logging.warning(f"Could not connect to server ws://{sub.socketioServer}:{sub.socketioPort}")
            time.sleep(4)

    rclpy.spin(sub)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    sub.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()