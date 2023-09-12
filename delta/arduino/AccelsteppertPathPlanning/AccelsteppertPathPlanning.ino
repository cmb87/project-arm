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


float P0[3] = {0, 0, 0};      // Initial positions  
float Pf[3] = {400, 700, 600}; // Final positions  
float P2[3]; // Final positions  
float V0[3] = {0, 0, 0};      // Initial velocities  
float Vf[3] = {0, 0, 0};      // Final velocities  
float T = 0.5;              // Total time (seconds)  
float dt = 0.0005;          // Time step (seconds)  

// Create MultiStepper instance  
MultiStepper steppers;  

AccelStepper Xaxis(1, 2, 5); // pin 2 = step, pin 5 = direction
AccelStepper Yaxis(1, 3, 6); // pin 2 = step, pin 5 = direction
AccelStepper Zaxis(1, 4, 7); // pin 2 = step, pin 5 = direction

// Create an array of pointers to AccelStepper instances  
AccelStepper* motors[] = {&Xaxis, &Yaxis, &Zaxis};  
const int numMotors = sizeof(motors) / sizeof(motors[0]);  



// ==================================
float cubicPath(float t, float P0, float Pf, float V0, float Vf, float T) {  
  float a0 = P0;  
  float a1 = V0;  
  float a2 = (3 * (Pf - P0) - (2 * V0 + Vf) * T) / (T * T);  
  float a3 = (2 * (P0 - Pf) + (V0 + Vf) * T) / (T * T * T);  
  
  float position = a0 + a1 * t + a2 * t * t + a3 * t * t * t;  
  return position;  
} 


// ==================================
void setup(){

    Serial.begin(9600);
    pinMode(enablePin, OUTPUT);
    digitalWrite(enablePin, LOW);

    steppers.addStepper(Xaxis);
    steppers.addStepper(Yaxis);  
    steppers.addStepper(Zaxis);  

  // Set motor maximum speed and acceleration  
    for (int i = 0; i < numMotors; i++) {  
      motors[i]->setMaxSpeed(2000);  
      motors[i]->setAcceleration(1000);  
    }  




    Serial.println("starting!");
    delay(1000); // Moment s'attente pour observer les moteurs
  
}

// ==================================
void loop(){

  while (Serial.available() == 0) {};
  int incomingByte = Serial.parseInt();


  Serial.println("-----------");
  Serial.print(P0[0]);
  Serial.print(", ");
  Serial.print(P0[1]);
  Serial.print(", ");
  Serial.print(P0[2]);
  Serial.print(" => ");
  Serial.print(Pf[0]);
  Serial.print(", ");
  Serial.print(Pf[1]);
  Serial.print(", ");
  Serial.print(Pf[2]);
  Serial.println();
  
  // -----------------------------
  if ( true ) {
  for (float t = 0; t <= T; t += dt) {  
    // Calculate target positions and speeds for each motor  

    for (int i = 0; i < numMotors; i++) {  
      float position = cubicPath(t, P0[i], Pf[i], V0[i], Vf[i], T);  
      float nextPosition = cubicPath(t + dt, P0[i], Pf[i], V0[i], Vf[i], T);  
      float deltaPosition = (nextPosition - position);  
      float speed = deltaPosition / dt;  
  
      // Serial.print(position);
      // Serial.print(", ");
      // Serial.print(nextPosition);
      // Serial.print(", ");
      // Serial.print(deltaPosition);
      // Serial.print(", ");
      // Serial.print(speed);  
      // Update motor speed  
      motors[i]->setSpeed(speed);  
    }  
    
    // Move motors  
    for (int i = 0; i < numMotors; i++) {  
      motors[i]->runSpeed();  
    }  
  
    // Wait for the next time step  
    delay(dt * 1000);  
  }  
  } ;

  // -----------------------------
  // for (float t = 0; t <= T; t += dt) {  
  //   // Calculate target positions for each motor  
  //   long targetPositions[2];  
  //   for (int i = 0; i < 2; i++) {  
  //     targetPositions[i] = cubicPath(t, P0[i], Pf[i], V0[i], Vf[i], T);  
  //   }  
  
  //   // Move motors to the target positions  
  //   steppers.moveTo(targetPositions);  
  
  //   // Run motors until they reach their target positions  
  //   while (steppers.run()) {  
  //     // Do nothing; wait for the motors to reach their target positions  
  //   }  
      
  //   // Wait for the next time step  
  //   delay(dt * 1000);  
  // }  








  // Copy the sourceArray elements to the destinationArray  
  for (int i = 0; i < 3; i++) {  
    P2[i] = P0[i];  
    P0[i] = Pf[i];  
  };

  for (int i = 0; i < 3; i++) {  
    Pf[i] = P2[i];  
  } 


  // Add any other logic or delay if needed  
  delay(500);  
} 