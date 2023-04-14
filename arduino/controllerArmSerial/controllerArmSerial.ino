#include <ros.h>
#include <ros/time.h>
#include <sensor_msgs/JointState.h>
#include <sensor_msgs/Range.h>
#include <Wire.h>
#include <VL53L0X.h>
#include <Servo.h>

// =========================================
ros::NodeHandle  nh;

VL53L0X sensor;
unsigned long range_timer;

// =========================================
#define SERVO1 3
#define SERVO2 5
#define SERVO3 6
#define SERVO4 9
#define SERVO5 11


#define SERVO1_MID_POS 90
#define SERVO2_MID_POS 90
#define SERVO3_MID_POS 90
#define SERVO4_MID_POS 90
#define SERVO5_MID_POS 90

Servo robot_servos[5];

// ========================================
// Subscriber Callback to store the jointstate position values in the global variables
void sub_cb_fn(const sensor_msgs::JointState& msg) {

  robot_servos[0].write(msg.position[0]*(180/3.14) + SERVO1_MID_POS);
  robot_servos[1].write(msg.position[1]*(180/3.14) + SERVO2_MID_POS);
  robot_servos[2].write(msg.position[2]*(180/3.14) + SERVO3_MID_POS);
  robot_servos[3].write(msg.position[3]*(180/3.14) + SERVO4_MID_POS);
  robot_servos[4].write(msg.position[4]*(180/3.14) + SERVO5_MID_POS);
  
  // Call the method to write the joint positions to the servo motors
  nh.spinOnce();
  delay(3);
}

// ========================================
ros::Subscriber<sensor_msgs::JointState> sub_cb("joint_states", &sub_cb_fn);

sensor_msgs::Range range_msg;
ros::Publisher pub_range( "range_data", &range_msg);



// =========================================
void setup() {

  //
  Wire.begin();

  //Servos
  //nh.loginfo("Configuring Servos");
  robot_servos[0].attach(SERVO1);
  robot_servos[1].attach(SERVO2);
  robot_servos[2].attach(SERVO3);
  robot_servos[3].attach(SERVO4);
  robot_servos[4].attach(SERVO5);
  robot_servos[0].write(SERVO1_MID_POS);
  robot_servos[1].write(SERVO2_MID_POS);
  robot_servos[2].write(SERVO3_MID_POS);
  robot_servos[3].write(SERVO4_MID_POS);
  robot_servos[4].write(SERVO5_MID_POS);

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



  // Node
  nh.getHardware()->setBaud(38400);

  nh.initNode();
  nh.advertise(pub_range);
  nh.subscribe(sub_cb);
  


  //nh.negotiateTopics();
  // wait controller to be connected
  // while (!nh.connected()){
  //   nh.loginfo("Wait until controller connects...");
  //   nh.spinOnce();
  // }

}


void loop() {
  //if ((millis()-range_timer) > 500){

  range_msg.range = (float)sensor.readRangeContinuousMillimeters()/1000.0; // (float)sensor.readRangeContinuousMillimeters();
  range_msg.header.stamp = nh.now();
  pub_range.publish(&range_msg);
  range_timer =  millis();    
  //}

  delay(100);
  nh.spinOnce();
  //delay(10);

}