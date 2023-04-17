#include <VL53L0X.h>
#include "SerialTransfer.h"
#include <Wire.h>
#include <Servo.h>


// ===================================================================
// ------------------ Laser Rangefinder ------------------
VL53L0X sensor;

float range1 = 0.0;
float range2 = 5.0;

int startTime = millis(); //used for our timing loop
int mInterval = 100; //refresh rate of 10hz


// ------------------ Serial ------------------
SerialTransfer myTransfer;

struct __attribute__((packed)) CONTROLLER {
  long angle1;
  long angle2;
  long angle3;
  long angle4;
  long angle5;
} commandStruct;

// 0 - 90 - 180

struct __attribute__((packed)) SENSORS {
  float range1;
  float range2;
  long angle1;
  long angle2;
  long angle3;
  long angle4;
  long angle5;
} sensorStruct;


// ------------------ Servos ------------------

Servo servo1;  // Rotate
Servo servo2;  // Joint1
Servo servo3;  // Joint2
Servo servo4;  // Joint3
Servo servo5;  // Endeffector



// ===================================================================

void setup()
{
  // ------------------ Serial ------------------
  Serial.begin(115200);
  Wire.begin();


  myTransfer.begin(Serial);

  servo1.attach(3); //D3
  servo2.attach(5); //D5
  servo3.attach(6); //D6
  servo4.attach(9); //D9
  servo5.attach(11); //D11

  // Write to servos
  servo1.write(90);
  servo2.write(90);
  servo3.write(90);
  servo4.write(90);
  servo5.write(90);

  // ------------------ sensor ------------------
  sensor.setTimeout(500);
  
  if (!sensor.init())
  {
    Serial.println("Failed to detect and initialize sensor!");
    while (1) {}
  }

  // Start continuous back-to-back mode (take readings as
  // fast as possible).  To use continuous timed mode
  // instead, provide a desired inter-measurement period in
  // ms (e.g. sensor.startContinuous(100)).
  sensor.startContinuous();

}

// ===================================================================

void loop()
{
  if(myTransfer.available())
  {


    // ------------------ Receive Serial ------------------
    // use this variable to keep track of how many
    // bytes we've processed from the receive buffer
    uint16_t recSize = 0;
    recSize = myTransfer.rxObj(commandStruct, recSize);

    // ------------------ ToDo: add ramp ---------------


    
    // Write to servos

    servo1.write(commandStruct.angle1);
    servo2.write(commandStruct.angle2);
    servo3.write(commandStruct.angle3);
    servo4.write(commandStruct.angle4);
    servo5.write(commandStruct.angle5);



    // ------------------ Receive Serial ---------------

    if((millis()- startTime) > mInterval) {
      range1 = (float)sensor.readRangeContinuousMillimeters()/1000.0;
      startTime = millis();
    }  

     // ------------------ Receive Serial ---------------
    sensorStruct.range1 = range1;
    sensorStruct.range2 = range2;

    sensorStruct.angle1 = servo1.read();
    sensorStruct.angle2 = servo2.read();
    sensorStruct.angle3 = servo3.read();    
    sensorStruct.angle4 = servo4.read();
    sensorStruct.angle5 = servo5.read();


    delay(3);
    // ------------------ Send Serial ------------------

    uint16_t sendSize = 0;
    sendSize = myTransfer.txObj(sensorStruct, sendSize);
    myTransfer.sendData(sendSize);

    
  }
}