import rclpy
import time
import logging
import socketio
import logging
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from cv_bridge import CvBridge, CvBridgeError

from .encoding import decode, encode

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
class SocketIOBridge(Node):

    def __init__(self):
        super().__init__(node_name='socketiopublisher')

        # Parameters
        self.declare_parameter("socketioserver", "localhost")
        self.declare_parameter("socketioport", 5000)
        self.declare_parameter("socketiosubtopic", "socketio2ros")
        self.declare_parameter("socketiopubtopic", "ros2socketio")

        self.declare_parameter("subtopic", "subtopic")
        self.declare_parameter("pubtopic", "pubtopic")

        self.declare_parameter("colormode", "rgb")

        self.socketioServer = self.get_parameter('socketioserver').value
        self.socketioPort = self.get_parameter('socketioport').value
        self.socketioSubTopic = self.get_parameter('socketiosubtopic').value
        self.socketioPubTopic = self.get_parameter('socketiopubtopic').value

        self.get_logger().info('Publishing to topic: "%s"' % self.get_parameter('pubtopic').value)
        self.get_logger().info('Listening  to topic: "%s"' % self.get_parameter('subtopic').value)

        # Create the cv_bridge object
        self.bridge = CvBridge()

        # Create publisher
        self.publisher = self.create_publisher(
            Image,
            self.get_parameter('pubtopic').value,
            10
        )

        # Create subscriber
        self.subscription = self.create_subscription(
            Image,
            self.get_parameter('subtopic').value,
            self.subscribe,
            10
        )

        # prevent unused variable warning
        self.subscription


    # =====================================
    def publish(self, base64string):
        # Use cv_bridge() to convert the ROS image to OpenCV format

        self.get_logger().info('Publishing...')

        # Publish it using roscv bridge
        self.publisher.publish(self.bridge.cv2_to_imgmsg(decode(base64string), "bgr8"))

    # =====================================
    def subscribe(self, ros_image):
        # Use cv_bridge() to convert the ROS image to OpenCV format
        try:
            frame = self.bridge.imgmsg_to_cv2(ros_image, "bgr8")
        except CvBridgeError:
            self.get_logger().info('CvBridge error encountered')
            frame = None

        # Emitting to socketio
        sio.emit(
            self.get_parameter('socketiopubtopic').value,
            {'frame': encode(frame) },
            namespace = '/ros2'
        )


        self.get_logger().info('Image Received')


# =====================================
def main(args=None):
    rclpy.init(args=args)
    pub = SocketIOBridge()

    @sio.event
    def connect():
        logging.info('Successfully connected to server.')

    @sio.event
    def connect_error():
        logging.info('Failed to connect to server.')

    @sio.event
    def disconnect():
        logging.info('Disconnected from server.')

    @sio.on(pub.socketioSubTopic, namespace="/ros2")
    def publish(msg):
        pub.publish(msg.frame)

    # Connect to socketio
    while True:
        try:
            sio.connect(f"ws://{pub.socketioServer}:{pub.socketioPort}", namespaces=["/ros2"])
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