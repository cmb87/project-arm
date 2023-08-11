// Stepper Motor X
const int stepPinX = 2; //X.STEP
const int dirPinX = 5; // X.DIR

const int stepPinY = 3; //Y.STEP
const int dirPinY = 6; // Y.DIR

const int stepPinZ = 4; //X.STEP
const int dirPinZ = 7; // X.DIR
  
// Define stepper motor connections and steps per revolution for the X axis motor:
#define stepPin 2
#define dirPin 5
#define enablePin 8  // ******** name the enable pin

#define stepsPerRevolution 200

void setup()
{
   // Declare pins as output:
   pinMode(stepPin, OUTPUT);
   pinMode(dirPin, OUTPUT);
   pinMode(enablePin, OUTPUT);  // ******** set the enable pinMode
   digitalWrite(enablePin, LOW); // ******** enable the motors
}

 void loop() {
  digitalWrite(dirPin,HIGH); // Enables the motor to move in a particular direction
  // Makes 200 pulses for making one full cycle rotation
  for(int x = 0; x < 200; x++) {
  digitalWrite(stepPin,HIGH); 
  delayMicroseconds(1500); 
  digitalWrite(stepPin,LOW); 
  delayMicroseconds(1500); 
  }
  delay(1000); // One second delay
  
  digitalWrite(dirPin,LOW); //Changes the rotations direction
  // Makes 400 pulses for making two full cycle rotation
  for(int x = 0; x < 400; x++) {
  digitalWrite(stepPin,HIGH);
  delayMicroseconds(1500);
  digitalWrite(stepPin,LOW);
  delayMicroseconds(1500);
  }
  delay(1000);
 }