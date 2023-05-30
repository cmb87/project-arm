
#include <Servo.h>
#include <Wire.h>
#include <VL53L0X.h>
#include <ros.h>
#include <std_msgs/Int32.h>
#include <sensor_msgs/Range.h>
#include <sensor_msgs/JointState.h>
#define USE_USBCON

ros::NodeHandle node_handle;
//ros::NodeHandle_<ArduinoHardware, 1, 1, 256, 256> node_handle;

Servo robot_servos[5];

int servo_pins[5] = {11, 9, 6, 5, 3}; // PWM Pins on Arduino Uno
//int servo_pins[5] = {11, 9, 6, 5, 3}; // PWM Pins on Arduino Uno

int mid_positions[5] = {90, 90, 90, 90, 90};
int SERVO_CURRENT_POSITIONS[5];

float TARGET_JOINT_POSITIONS[5] = {0,0,0,0,0};

// Convert the joint state values to degrees, adjust for the center and write to the servo
void writeServos() {
  for (int j = 0; j < 5; j++) {
    int target_angle = TARGET_JOINT_POSITIONS[j]*(180/3.14) + mid_positions[j];

    robot_servos[j].write(target_angle);
    SERVO_CURRENT_POSITIONS[j] = target_angle;
  }
  //node_handle.spinOnce();
}

// Subscriber Callback to store the jointstate position values in the global variables
void servoControlSubscriberCallbackJointState(const sensor_msgs::JointState& msg) {
  node_handle.loginfo("Received joint_states");

  TARGET_JOINT_POSITIONS[3] =  -msg.position[1];
  TARGET_JOINT_POSITIONS[4] =  -msg.position[0];
  TARGET_JOINT_POSITIONS[2] =  msg.position[2];
  TARGET_JOINT_POSITIONS[1] =  -msg.position[3];
  TARGET_JOINT_POSITIONS[0] = -msg.position[4];

  // Call the method to write the joint positions to the servo motors
  writeServos();
}

// ============================
VL53L0X sensor;
long range_time;

sensor_msgs::Range range_msg;

ros::Publisher pub_range( "range_data", &range_msg);
ros::Subscriber<sensor_msgs::JointState> servo_control_subscriber_joint_state("joint_states", &servoControlSubscriberCallbackJointState);


void setup() {

  Wire.begin();

  // VL53L0X
  if (!sensor.init()) {
    //nh.logwarn("Failed to setup VL53L0X sensor");
    while(1) {};
  }
  sensor.startContinuous();

  // Range message
  range_msg.radiation_type = sensor_msgs::Range::INFRARED;
  range_msg.header.frame_id =  "ir_ranger";
  range_msg.field_of_view = 0.44; //25 degrees
  range_msg.min_range = 0.03;
  range_msg.max_range = 2.0;

  // Initial the servo motor connections and initialize them at home position
  for (unsigned int i = 0; i < 5; i++) {
    robot_servos[i].attach(servo_pins[i]);
    robot_servos[i].write(mid_positions[i]);
    SERVO_CURRENT_POSITIONS[i] = mid_positions[i];
  }

  // Set the communication BaudRate and start the node
  node_handle.getHardware()->setBaud(115200);
  node_handle.initNode();
  node_handle.subscribe(servo_control_subscriber_joint_state);
  node_handle.advertise(pub_range);

}




void loop() {


  if ( millis() >= range_time ){
    range_msg.range = (float)sensor.readRangeContinuousMillimeters()/1000.0; // (float)sensor.readRangeContinuousMillimeters();
    range_msg.header.stamp = node_handle.now();
    pub_range.publish(&range_msg);
    range_time =  millis() + 1000;
  } 
  node_handle.spinOnce();


  
}


