// Stepper Motor X
const int stepPinX = 2; //X.STEP
const int dirPinX = 5; // X.DIR

const int stepPinY = 3; //Y.STEP
const int dirPinY = 6; // Y.DIR

const int stepPinZ = 4; //Z.STEP
const int dirPinZ = 7; // Z.DIR
  
int incomingByte = 0;

// Define stepper motor connections and steps per revolution for the X axis motor:
#define stepPin 2
#define dirPin 5
#define enablePin 8  // ******** name the enable pin

#define stepsPerRevolution 200

void setup(){

   Serial.begin(9600);

   // Declare pins as output:
   pinMode(stepPinX, OUTPUT);
   pinMode(dirPinX, OUTPUT);
   pinMode(stepPinY, OUTPUT);
   pinMode(dirPinY, OUTPUT);
   pinMode(stepPinZ, OUTPUT);
   pinMode(dirPinZ, OUTPUT);

   pinMode(enablePin, OUTPUT);  // ******** set the enable pinMode
   digitalWrite(enablePin, LOW); // ******** enable the motors
}


 void loop() {
  while (Serial.available() == 0) {}


  int incomingByte = Serial.parseInt();

  if (incomingByte == 0 ) {;

  } else {

  Serial.print("Doing "); 
  Serial.print(incomingByte); 
  Serial.println("steps!"); 

  if (incomingByte<0) {
    digitalWrite(dirPinX,HIGH);
    digitalWrite(dirPinY,HIGH);
    digitalWrite(dirPinZ,HIGH);
    Serial.println("Changing direction to CW"); 
  } else {
    digitalWrite(dirPinX,LOW);
    digitalWrite(dirPinY,LOW);
    digitalWrite(dirPinZ,LOW);
    Serial.println("Changing direction to CCW"); 
  }




  // Makes 200 pulses for making one full cycle rotation
  for(int x = 0; x < incomingByte; x++) {
    digitalWrite(stepPinX,HIGH); 
    digitalWrite(stepPinY,HIGH); 
    digitalWrite(stepPinZ,HIGH); 
    delayMicroseconds(3600); 
    digitalWrite(stepPinX,LOW); 
    digitalWrite(stepPinY,LOW); 
    digitalWrite(stepPinZ,LOW); 
    delayMicroseconds(3600); 
  }
  delay(1000); // One second delay
  Serial.println("Completed!"); 
  }

 }