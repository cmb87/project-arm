import { Trajectory } from "./trajectory";
import { Vector } from "./vector";

// https://hypertriangle.com/~alex/delta-robot-tutorial/


export interface IXCinematic {
  base: number[][][]
  endeffector: number[][][]
  joints: number[][][]
}


export class DeltaRobot {

    private e: number
    private f: number
    private re: number
    private rf: number

    private xoff: number[]
    private scale: number

    private  sqrt3: number = Math.sqrt(3.0);
    private  pi: number = 3.141592653;    // PI
    private  sin120: number = this.sqrt3/2.0; 
    private  cos120: number = -0.5;    
    private  tan60: number = this.sqrt3;
    private  sin30: number = 0.5;
    private  cos30: number = 0.5*this.sqrt3;
    private  tan30: number = 1/this.sqrt3;

    private xe: number[] = [0,0,0];
    private jointStates: number[] = [0,0,0];

    // For plotting joint state history
    public jointStatesHist: {t: number, theta: number, id: string}[] = [];
    public maxHistSteps: number= 300

    // Just for plotting
    private xCinematic: IXCinematic = {base: [], endeffector: [], joints: []}

    public trajectory: Trajectory

    // -----------------------------------------------
    constructor(e:number, f:number, re:number, rf:number, xoff: number[] = [0.5,0.5,0.5], scale: number = 1.0) {
      this.e = e;     // end effector
      this.f = f;     // base
      this.re = re;
      this.rf = rf;

      this.xoff = xoff;
      this.scale = scale;

      this.trajectory = new Trajectory();

      console.log("New Robot created")
    }


    // -----------------------------------------------
    public forwardKinematic(jointStates: number[]) {

      const t: number  = (this.f-this.e)*this.tan30/2;

      jointStates = jointStates
      this.jointStates = [...jointStates]

      const y1: number  = -(t + this.rf*Math.cos(jointStates[0]));
      const z1: number  = -this.rf*Math.sin(jointStates[0]);
  
      const y2: number = (t + this.rf*Math.cos(jointStates[1]))*this.sin30;
      const x2: number= y2*this.tan60;
      const z2: number = -this.rf*Math.sin(jointStates[1]);
  
      const y3: number = (t + this.rf*Math.cos(jointStates[2]))*this.sin30;
      const x3: number = -y3*this.tan60;
      const z3: number = -this.rf*Math.sin(jointStates[2]);
  
      const dnm: number = (y2-y1)*x3-(y3-y1)*x2;
  
      const w1: number = y1*y1 + z1*z1;
      const w2: number = x2*x2 + y2*y2 + z2*z2;
      const w3: number = x3*x3 + y3*y3 + z3*z3;
      
      // x = (a1*z + b1)/dnm
      const a1: number = (z2-z1)*(y3-y1)-(z3-z1)*(y2-y1);
      const b1: number= -((w2-w1)*(y3-y1)-(w3-w1)*(y2-y1))/2.0;
  
      // y = (a2*z + b2)/dnm;
      const a2: number = -(z2-z1)*x3+(z3-z1)*x2;
      const b2: number = ((w2-w1)*x3 - (w3-w1)*x2)/2.0;
  
      // a*z^2 + b*z + c = 0
      const a: number = a1*a1 + a2*a2 + dnm*dnm;
      const b: number = 2*(a1*b1 + a2*(b2-y1*dnm) - z1*dnm*dnm);
      const c: number = (b2-y1*dnm)*(b2-y1*dnm) + b1*b1 + dnm*dnm*(z1*z1 - this.re*this.re);
   
      // discriminant
      const d: number = b*b - 4.0*a*c;
      if (d < 0) return -1; // non-existing point
  
      const ze: number = -0.5*(b+Math.sqrt(d))/a;
      const xe: number = (a1*ze + b1)/dnm;
      const ye: number = (a2*ze + b2)/dnm;

      // Store internally
      this.xe = [xe, ye, ze]
      

      this.calculateGeometry();

      return {status: 0, x:  Vector.normalize(this.xe, this.xoff, this.scale, true)}
    }

    // -----------------------------------------------
    private delta_calcAngleYZ(xe: number, ye: number, ze: number) {

      let theta: number = 0.0;

      const y1: number = -0.5 * 0.57735 * this.f; // f/2 * tg 30
      ye -= 0.5 * 0.57735 * this.e;    // shift center to edge
      // z = a + b*y
      const a: number = (xe*xe + ye*ye + ze*ze +this.rf*this.rf - this.re*this.re - y1*y1)/(2*ze);
      const b: number = (y1-ye)/ze;
      // discriminant
      const d: number = -(a+b*y1)*(a+b*y1)+this.rf*(b*b*this.rf+this.rf); 

      if (d < 0) return {status: -1, theta: theta}; // non-existing point

      const yj: number = (y1 - a*b - Math.sqrt(d))/(b*b + 1); // choosing outer point
      const zj: number = a + b*yj;
      theta = Math.atan(-zj/(y1 - yj)) + ((yj>y1)?this.pi:0.0);

      return {status: 0, theta: theta}
    }

    // -----------------------------------------------
    public inverseKinematic(xstar: number[]) {

      // we must invert z for this robot

      xstar[2] = 1.0-xstar[2]
      const xe = Vector.unnormalize(xstar, this.xoff, this.scale);

      const res1 = this.delta_calcAngleYZ(xe[0], xe[1], xe[2]);
      const res2 = this.delta_calcAngleYZ(xe[0]*this.cos120 + xe[1]*this.sin120, xe[1]*this.cos120-xe[0]*this.sin120, xe[2]);
      const res3 = this.delta_calcAngleYZ(xe[0]*this.cos120 - xe[1]*this.sin120, xe[1]*this.cos120+xe[0]*this.sin120, xe[2]);

      this.jointStates = [res1.theta, res2.theta, res3.theta];

      const xf = this.forwardKinematic(this.jointStates);

      if ( xf !== -1 ) {
        const error = xf.x.reduce((sum:number,xfstar:number,idx:number) => sum+(xfstar-xstar[idx])*(xfstar-xstar[idx]),0)
        return {status: 0, jointAngles: this.jointStates, mse: error}
      }
      
      return {status: -1, jointAngles: [0,0,0], mse: 9999}
      
    }


    // -----------------------------------------------
    public getCurrentJointStates(radiants: boolean = true) {
      return this.jointStates.map((x:number) => radiants ? x : x/this.pi*180)
    }

    // -----------------------------------------------
    public getCurrentEndEffectorPosition(normalized:boolean = false) {
      return normalized? Vector.normalize(this.xe, this.xoff, this.scale) : this.xe;
    }

    // -----------------------------------------------
    public async run(dt: number=100, updateTrigger: Function = ()=>{}) {

      this.trajectory.start();
  
      while (true) {
        
        const t = new Date().getTime();
  
        if (t>=this.trajectory.getEndTime()) break;
  
        // Get target state
        const jointStatesTarget = this.trajectory.getJointTarget(t);
  
        // Run forward kinematic
        this.forwardKinematic(jointStatesTarget);

        // For cinematic
        this.calculateGeometry();
        
        // Remove older entries
        if (this.jointStatesHist.length > 3*this.maxHistSteps) this.jointStatesHist.shift();this.jointStatesHist.shift();this.jointStatesHist.shift();
        
        jointStatesTarget.forEach((x:number, idx:number) => this.jointStatesHist.push({t: t, theta: x, id: `theta_${idx}`}))  

        updateTrigger(t);
  
        await new Promise(r => setTimeout(r, Math.round(dt)));
        
      }

    }
    // -----------------------------------------------
    public async runRobot(dt: number=100, updateTrigger: Function = ()=>{}, socket: any) {

      this.trajectory.start();

      
      for (let i = 0; i < this.trajectory.getAllTargets().length; i++) {
        const target = this.trajectory.getAllTargets()[i];

        
      }

    }



    // -----------------------------------------------
    public calculateGeometry() {
      // calculate the position of all robot joints. Expects forwardKinematics to be run prior to execution

      
      const [theta3, theta2, theta1] = this.jointStates;
      const [xe, ye, ze] = this.xe;

      const k: number = this.f*Math.sqrt(3/4);
      const b: number = this.f/2*this.tan30;

      const ke: number = this.e*Math.sqrt(3/4);
      const be: number = this.e/2*this.tan30;

      
      // Static platform
      const xp1: number[] = [ this.f/2, -b, 0]
      const xp2: number[] = [-this.f/2, -b, 0]
      const xp3: number[] = [0, this.f/2*this.tan60 -b, 0]

      // Biceps Plattform
      const xf1: number[] = [ this.f/2-k*this.cos30, -b + k*this.sin30,0 ]
      const xf2: number[] = [-this.f/2+k*this.cos30, -b + k*this.sin30,0]
      const xf3: number[] = [0, -b, 0]

      // Biceps
      const xrf1: number[] = [
        xf1[0] - this.rf*this.cos30*Math.cos(theta1),
        xf1[1] + this.rf*this.sin30*Math.cos(theta1),
        xf1[2] - this.rf*Math.sin(theta1)
      ]
      const xrf2: number[] = [
        xf2[0] + this.rf*this.cos30*Math.cos(theta2),
        xf2[1] + this.rf*this.sin30*Math.cos(theta2),
        xf2[2] - this.rf*Math.sin(theta2)
      ]
      const xrf3: number[] = [
        xf3[0],
        xf3[1] - this.rf*Math.cos(theta3) ,
        xf3[2] - this.rf*Math.sin(theta3) ,
      ]

      // Endeffector Platform
      const xep1: number[] = [ xe + this.e/2, ye -be, ze ]
      const xep2: number[] = [ xe - this.e/2, ye -be, ze ]
      const xep3: number[] = [ xe, ye + this.e/2*this.tan60 -be,  ze]


      // const xp1: number[] = [ this.f/2, -b, 0]
      // const xp2: number[] = [-this.f/2, -b, 0]
      // const xp3: number[] = [0, this.f/2*this.tan60 -b, 0]
      
      // Elbow
      const xe1: number[] = [
        xe + this.e/2-ke*this.cos30,
        ye -be + ke*this.sin30,
        ze 
      ]
      const xe2: number[] = [
        xe + -this.e/2+ke*this.cos30,
        ye -be + ke*this.sin30,
        ze
      ]
      const xe3: number[] = [
        xe,
        ye -  be,
        ze
      ]

      this.xCinematic = {
        base: [[
          Vector.normalize(xp1, this.xoff, this.scale, true),
          Vector.normalize(xp2, this.xoff, this.scale, true),
          Vector.normalize(xp3, this.xoff, this.scale, true),
          Vector.normalize(xp1, this.xoff, this.scale, true),
        ]],
        endeffector: [
          [
          Vector.normalize(xep1, this.xoff, this.scale, true),
          Vector.normalize(xep2, this.xoff, this.scale, true),
          Vector.normalize(xep3, this.xoff, this.scale, true),
          Vector.normalize(xep1, this.xoff, this.scale, true),
          ]],
        joints: [
          [
            Vector.normalize(xf1, this.xoff, this.scale, true),
            Vector.normalize(xrf1, this.xoff, this.scale, true),
          ],
          [
            Vector.normalize(xf2, this.xoff, this.scale, true),
            Vector.normalize(xrf2, this.xoff, this.scale, true),
          ],
          [
            Vector.normalize(xf3, this.xoff, this.scale, true),
            Vector.normalize(xrf3, this.xoff, this.scale, true),
          ],
          [
            Vector.normalize(xrf1, this.xoff, this.scale, true),
            Vector.normalize(xe1, this.xoff, this.scale, true),
          ],
          [
            Vector.normalize(xrf2, this.xoff, this.scale, true),
            Vector.normalize(xe2, this.xoff, this.scale, true),
          ],
          [
            Vector.normalize(xrf3, this.xoff, this.scale, true),
            Vector.normalize(xe3, this.xoff, this.scale, true),
          ]
        ]
      }

    }

    // -----------------------------------------------
    public plot(ctx: CanvasRenderingContext2D, iw: number, ih: number, xaxis: number=0, yaxis: number= 2) {

      
      const component: string[] = ["base", "endeffector", "joints"];
      const colors = {
        base: "rgba(10, 10, 10, 1.0)",
        endeffector: "rgba(0, 0, 0, 1.0)",
        joints: "rgba(165, 165, 165, 1.0)"
      }
      
      const xe =  Vector.normalize([...this.xe], this.xoff, this.scale, true) 

      // ----------------------------------------
      if (yaxis == 2) {
        ctx.fillStyle = "rgba(128,0,0, 0.2)";
        ctx.fillRect(
          0,
          (1-this.xoff[2]  + (this.rf+this.re)/this.scale )*ih, 
          iw,
          ih  
        );
        ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        ctx.fillRect(
          0,
          0,
          iw,
          (1-this.xoff[2]  + (this.rf+this.re)/this.scale )*ih,   
        ); 
        } else {
          ctx.fillStyle = "rgba(128,0,0, 0.2)";
          ctx.fillRect(
            0,
            0,
            iw,
            ih  
          ); 
        }
      ctx.stroke();

      ctx.font = "20px mono";
      ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
      ctx.fillText(`${this.xe[xaxis].toFixed(2)}m`, (xe[xaxis])*iw-10, ih-10);
      ctx.fillText(`${this.xe[yaxis].toFixed(2)}m`, 10, (xe[yaxis] )*ih-10);
      ctx.stroke();

      // -----------------------------------------
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"
      ctx.beginPath();
      ctx.moveTo(
        Math.floor(
          (xe[xaxis])*iw  
        ),
        0
      );
      ctx.lineTo(
        Math.floor(
          (xe[xaxis] )*iw
        ),
        ih
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        0,
        Math.floor(
          (xe[yaxis] )*ih  
        ),
      );
      ctx.lineTo(
        iw,
        Math.floor(
          (xe[yaxis] )*ih  
        )
      );
      ctx.stroke();

      // -----------------------------------------
      ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
      ctx.setLineDash([]);
      ctx.lineWidth = 10;

      for (var c = 0; c < component.length; c++) {
        ctx.strokeStyle = colors[component[c] as keyof typeof colors];  
        const x = this.xCinematic[component[c] as keyof typeof this.xCinematic]
        
        for (var i = 0; i < x.length; i++) {
          for (var j = 0; j < x[i].length-1; j++) {

            ctx.beginPath();
            ctx.moveTo(
              Math.floor(
                (x[i][j][xaxis] )*iw  
              ),
              Math.floor(
                (x[i][j][yaxis] )*ih
              )
            );
            ctx.lineTo(
              Math.floor(
                (x[i][j+1][xaxis] )*iw
              ),
              Math.floor(
                (x[i][j+1][yaxis] )*ih
              )
            );

            ctx.fillRect(
              Math.floor((x[i][j][xaxis])*iw )-5,
              Math.floor((x[i][j][yaxis])*ih )-5,
              10,10
            );
            ctx.fillRect(
              Math.floor((x[i][j+1][xaxis] )*iw )-5,
              Math.floor((x[i][j+1][yaxis] )*ih )-5,
              10,10
            );
            
            ctx.stroke();
          }
        } 
      }

    }
    

    
}