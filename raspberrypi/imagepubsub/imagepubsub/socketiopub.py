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

from .encoding import decode

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
class SocketIOPub(Node):

    def __init__(self):
        super().__init__(node_name='socketiopublisher')

        # Parameters
        self.declare_parameter("socketioserver", "localhost")
        self.declare_parameter("socketioport", 5000)
        self.declare_parameter("socketionamespace", "cv")
        self.declare_parameter("socketiotopic", "ros2server")

        self.declare_parameter("topic", "topic")

        self.socketioServer = self.get_parameter('socketioserver').value
        self.socketioPort = self.get_parameter('socketioport').value
        self.socketioNS = self.get_parameter('socketionamespace').value
        self.socketioTopic = self.get_parameter('socketiotopic').value

        self.get_logger().info('Publishing to topic: "%s"' % self.get_parameter('topic').value)

        # Create publisher
        self.publisher = self.create_publisher(
            Image,
            self.get_parameter('topic').value,
            10
        )

        # Create the cv_bridge object
        self.bridge = CvBridge()


    # =====================================
    def publish(self, base64string):
        # Use cv_bridge() to convert the ROS image to OpenCV format

        self.get_logger().info('Publishing...')

        # Publish it using roscv bridge
        self.publisher.publish(self.bridge.cv2_to_imgmsg(decode(base64string), "bgr8"))



# =====================================
def main(args=None):
    rclpy.init(args=args)
    pub = SocketIOPub()

    @sio.event
    def connect():
        logging.info('Successfully connected to server.')

    @sio.event
    def connect_error():
        logging.info('Failed to connect to server.')

    @sio.event
    def disconnect():
        logging.info('Disconnected from server.')

    @sio.on(pub.socketioTopic, namespace=pub.socketioNS)
    def publish(msg):
        pub.publish(msg.frame)

    # Connect to socketio
    while True:
        try:
            sio.connect(f"ws://{pub.socketioServer}:{pub.socketioPort}", namespaces=[pub.socketioNS])
            break
        except:
            logging.warning(f"Could not connect to server ws://{pub.socketioServer}:{pub.socketioPort}")
            time.sleep(4)

    rclpy.spin(pub)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    pub.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()