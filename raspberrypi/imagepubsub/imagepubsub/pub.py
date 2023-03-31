import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from cv_bridge import CvBridge, CvBridgeError
import sys
import numpy as np

# =====================================
class MinimalPublisher(Node):

    def __init__(self, timer_period=0.5):
        super().__init__(node_name='publisher')

        topic = self.declare_parameter("topic", "topic")

        self.get_logger().info('Publishing to topic: "%s"' % self.get_parameter('topic').value)
        self.publisher = self.create_publisher(
            Image,
            self.get_parameter('topic').value,
            10
        )

        # Create the cv_bridge object
        self.bridge = CvBridge()

        # Peridically publish images
        self.timer = self.create_timer(timer_period, self.publish)


    # =====================================
    def publish(self):
        # Use cv_bridge() to convert the ROS image to OpenCV format

        self.get_logger().info('Publishing...')
        # Create random picture
        rgb = np.random.randint(255, size=(900,800,3),dtype=np.uint8)
        # Publish it using roscv bridge
        self.publisher.publish(self.bridge.cv2_to_imgmsg(rgb, "bgr8"))


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