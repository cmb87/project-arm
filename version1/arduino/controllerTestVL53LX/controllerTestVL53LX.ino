#include <ros.h>
#include <ros/time.h>
#include <sensor_msgs/Range.h>
#include <Wire.h>
#include <VL53L0X.h>

ros::NodeHandle  nh;
sensor_msgs::Range range_msg;
ros::Publisher pub_range( "range_data", &range_msg);
VL53L0X sensor;

unsigned long range_timer;


// =========================================
void setup() {
  Wire.begin();

  nh.initNode();
  nh.getHardware()->setBaud(57600);
  nh.advertise(pub_range);

  // wait controller to be connected
  while (!nh.connected()){
    nh.loginfo("Wait until controller connects...");
    nh.spinOnce();
  }

  nh.loginfo("VL53L0X API serial node started");
  // if initialization failed - write message and freeze
  if (!sensor.init()) {
    nh.logwarn("Failed to setup VL53L0X sensor");
    while(1) {};
  }

  
  // fill static range message fields
  range_msg.radiation_type = sensor_msgs::Range::INFRARED;
  range_msg.header.frame_id =  "ir_ranger";
  range_msg.field_of_view = 0.44; //25 degrees
  range_msg.min_range = 0.03;
  range_msg.max_range = 1.2;

  nh.loginfo("VL53L0X started");
  sensor.startContinuous();


}


void loop() {
  if ((millis()-range_timer) > 50){

      range_msg.range = (float)sensor.readRangeContinuousMillimeters(); // (float)sensor.readRangeContinuousMillimeters();
      range_msg.header.stamp = nh.now();
      pub_range.publish(&range_msg);

    range_timer =  millis();    
  }
  nh.spinOnce();
  delay(1);
}