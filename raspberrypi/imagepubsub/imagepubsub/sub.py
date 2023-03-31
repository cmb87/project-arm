import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from cv_bridge import CvBridge, CvBridgeError


# =====================================
class MinimalSubscriber(Node):

    def __init__(self):
        super().__init__('minimal_subscriber')

        topic = self.declare_parameter("topic", "topic")

        self.get_logger().info('Subscribing to topic: "%s"' % self.get_parameter('topic').value)

        self.subscription = self.create_subscription(
            Image,
            self.get_parameter('topic').value,
            self.listener_callback,
            10)

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

        print(frame)

        self.get_logger().info('Image Received')




# =====================================
def main(args=None):
    rclpy.init(args=args)

    sub = MinimalSubscriber()
    rclpy.spin(sub)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    sub.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()