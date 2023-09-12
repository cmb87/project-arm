#include <AccelStepper.h>
#include <MultiStepper.h>

// Stepper Motor X
const int stepPinX = 2; //X.STEP
const int dirPinX = 5; // X.DIR

const int stepPinY = 3; //Y.STEP
const int dirPinY = 6; // Y.DIR

const int stepPinZ = 4; //Z.STEP
const int dirPinZ = 7; // Z.DIR
  
int incomingByte = 0;
const byte enablePin = 8;
int coef=1; // coef multiplicateur utile pour le programme final


AccelStepper Xaxis(1, 2, 5); // pin 2 = step, pin 5 = direction
AccelStepper Yaxis(1, 3, 6); // pin 2 = step, pin 5 = direction
AccelStepper Zaxis(1, 4, 7); // pin 2 = step, pin 5 = direction

MultiStepper steppers;


void setup(){

    Serial.begin(9600);
    pinMode(enablePin, OUTPUT);
    digitalWrite(enablePin, LOW);


    Xaxis.setMaxSpeed(700);
    Yaxis.setMaxSpeed(700);
    Zaxis.setMaxSpeed(700);
    Xaxis.setAcceleration(10);
    Yaxis.setAcceleration(10);
    Zaxis.setAcceleration(10);
    //add steppers to the MultiStepper object
    steppers.addStepper(Xaxis);
    steppers.addStepper(Yaxis);
    steppers.addStepper(Zaxis);
    delay(1000); // Moment s'attente pour observer les moteurs
 
}

void loop(){

  while (Serial.available() == 0) {};

  int incomingByte = Serial.parseInt();
  if (incomingByte == 0 ) {

  } else {
     Serial.print("Deplacing by");
     Serial.println(incomingByte);
     deplace(incomingByte, incomingByte, incomingByte);
  };
}

// void loop() {
//   stepper.setSpeed(40);
//   while (!endStopHit()) {
//     stepper.setSpeed(stepper.speed()*1.01);
//     stepper.runSpeed();
//   }
// }

void deplace(int x, int y, int z) {
    int32_t positions[3];        
    positions[0] = x*coef + Xaxis.currentPosition();        
    positions[1] = y*coef + Yaxis.currentPosition();
    positions[2] = z*coef + Yaxis.currentPosition();

    steppers.moveTo(positions);

    steppers.runSpeedToPosition();         
}


// // Define stepper motor connections and steps per revolution for the X axis motor:
// #define stepPin 2
// #define dirPin 5
// #define enablePin 8  // ******** name the enable pin

// #define stepsPerRevolution 200

// void setup(){

//    Serial.begin(9600);

//    // Declare pins as output:
//    pinMode(stepPinX, OUTPUT);
//    pinMode(dirPinX, OUTPUT);
//    pinMode(stepPinY, OUTPUT);
//    pinMode(dirPinY, OUTPUT);
//    pinMode(stepPinZ, OUTPUT);
//    pinMode(dirPinZ, OUTPUT);

//    pinMode(enablePin, OUTPUT);  // ******** set the enable pinMode
//    digitalWrite(enablePin, LOW); // ******** enable the motors
// }


//  void loop() {
//   while (Serial.available() == 0) {}


//   int incomingByte = Serial.parseInt();

//   if (incomingByte == 0 ) {;

//   } else {

//   Serial.print("Doing "); 
//   Serial.print(incomingByte); 
//   Serial.println("steps!"); 

//   if (incomingByte<0) {
//     digitalWrite(dirPinX,HIGH);
//     digitalWrite(dirPinY,HIGH);
//     digitalWrite(dirPinZ,HIGH);
//     Serial.println("Changing direction to CW"); 
//   } else {
//     digitalWrite(dirPinX,LOW);
//     digitalWrite(dirPinY,LOW);
//     digitalWrite(dirPinZ,LOW);
//     Serial.println("Changing direction to CCW"); 
//   }




//   // Makes 200 pulses for making one full cycle rotation
//   for(int x = 0; x < incomingByte; x++) {
//     digitalWrite(stepPinX,HIGH); 
//     digitalWrite(stepPinY,HIGH); 
//     digitalWrite(stepPinZ,HIGH); 
//     delayMicroseconds(3600); 
//     digitalWrite(stepPinX,LOW); 
//     digitalWrite(stepPinY,LOW); 
//     digitalWrite(stepPinZ,LOW); 
//     delayMicroseconds(3600); 
//   }
//   delay(1000); // One second delay
//   Serial.println("Completed!"); 
//   }

//  }