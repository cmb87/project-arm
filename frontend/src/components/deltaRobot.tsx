import { Trajectory } from "./trajectory";


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

    private xoff: number
    private yoff: number
    private zoff: number

    private  sqrt3: number = Math.sqrt(3.0);
    private  pi: number = 3.141592653;    // PI
    private  sin120: number = this.sqrt3/2.0; 
    private  cos120: number = -0.5;    
    private  tan60: number = this.sqrt3;
    private  sin30: number = 0.5;
    private  cos30: number = 0.5*this.sqrt3;
    private  tan30: number = 1/this.sqrt3;

    private xe: number[] = [0,0,0];
    private jointStates: number[] = [0,0.0,0];

    public update: boolean = false;

    // Just for plotting
    private xCinematic: IXCinematic = {base: [], endeffector: [], joints: []}

    public trajectory: Trajectory

    // -----------------------------------------------
    constructor(e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0) {
      this.e = e;     // end effector
      this.f = f;     // base
      this.re = re;
      this.rf = rf;

      this.xoff = xoff;
      this.yoff = yoff;
      this.zoff = zoff;

      this.trajectory = new Trajectory();

      console.log("New Robot created")
    }


    // -----------------------------------------------
    public forwardKinematic(theta1: number, theta2: number, theta3: number) {

      const t: number  = (this.f-this.e)*this.tan30/2;
      const dtr: number  = this.pi/180.0;
  
      // Convert to radiants
      theta1 *= dtr;
      theta2 *= dtr;
      theta3 *= dtr;
  
      const y1: number  = -(t + this.rf*Math.cos(theta1));
      const z1: number  = -this.rf*Math.sin(theta1);
  
      const y2: number = (t + this.rf*Math.cos(theta2))*this.sin30;
      const x2: number= y2*this.tan60;
      const z2: number = -this.rf*Math.sin(theta2);
  
      const y3: number = (t + this.rf*Math.cos(theta3))*this.sin30;
      const x3: number = -y3*this.tan60;
      const z3: number = -this.rf*Math.sin(theta3);
  
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
      this.jointStates = [theta1, theta2, theta3]

      return {status: 0, x: [xe+this.xoff, ye+this.yoff, ze+this.zoff]}
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
      theta = 180.0*Math.atan(-zj/(y1 - yj))/this.pi + ((yj>y1)?180.0:0.0);

      return {status: 0, theta: theta}
    }

    // -----------------------------------------------
    public inverseKinematic(x0: number, y0: number, z0: number) {

      x0 = x0 - this.xoff;
      y0 = y0 - this.yoff;
      z0 = z0 - this.zoff;


      const res1 = this.delta_calcAngleYZ(x0, y0, z0);
      const res2 = this.delta_calcAngleYZ(x0*this.cos120 + y0*this.sin120, y0*this.cos120-x0*this.sin120, z0);
      const res3 = this.delta_calcAngleYZ(x0*this.cos120 - y0*this.sin120, y0*this.cos120+x0*this.sin120, z0);

      return {status: res1.status+res2.status+res3.status, jointAngles: [res1.theta, res2.theta, res3.theta]}
    }


    // -----------------------------------------------
    public getCurrentJointStates() {
      return this.jointStates
    }

    // -----------------------------------------------
    public getCurrentEndEffectorPosition() {
      return [this.xe[0]+this.xoff, this.xe[1]+this.yoff, this.xe[2]+this.zoff]
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
        base: [[xp1, xp2, xp3, xp1]],
        endeffector: [[xep1, xep2, xep3, xep1]],
        joints: [
          [xf1, xrf1],
          [xf2, xrf2],
          [xf3, xrf3],
          [xrf1, xe1],
          [xrf2, xe2],
          [xrf3, xe3]
        ]
      }
      this.update = !this.update;
      
    }

    // -----------------------------------------------
    public plot(ctx: CanvasRenderingContext2D, iw: number, ih: number, xaxis: number=0, yaxis: number= 2) {

      
      const component: string[] = ["base", "endeffector", "joints"];
      const xoff = [this.xoff, this.yoff, this.zoff]
      const colors = {
        base: "rgba(0, 0, 255, 0.6)",
        endeffector: "rgba(255, 0, 0, 0.6)",
        joints: "rgba(155, 155, 155, 0.6)"
      }

      // -----------------------------------------
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"
      ctx.beginPath();
      ctx.moveTo(
        Math.floor(
          (this.xe[xaxis] + xoff[xaxis])*iw  
        ),
        0
      );
      ctx.lineTo(
        Math.floor(
          (this.xe[xaxis] + xoff[xaxis])*iw
        ),
        ih
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        0,
        Math.floor(
          (this.xe[yaxis] + xoff[xaxis])*ih  
        ),
      );
      ctx.lineTo(
        iw,
        Math.floor(
          (this.xe[yaxis] + xoff[xaxis])*ih  
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
                (x[i][j][xaxis] + xoff[xaxis])*iw  
              ),
              Math.floor(
                (x[i][j][yaxis] + xoff[yaxis])*ih
              )
            );
            ctx.lineTo(
              Math.floor(
                (x[i][j+1][xaxis] + xoff[xaxis])*iw
              ),
              Math.floor(
                (x[i][j+1][yaxis] + xoff[yaxis])*ih
              )
            );

            ctx.fillRect(
              Math.floor((x[i][j][xaxis] + xoff[xaxis])*iw )-5,
              Math.floor((x[i][j][yaxis] + xoff[yaxis])*ih )-5,
              10,10
            );
            ctx.fillRect(
              Math.floor((x[i][j+1][xaxis] + xoff[xaxis])*iw )-5,
              Math.floor((x[i][j+1][yaxis] + xoff[yaxis])*ih )-5,
              10,10
            );
            
            ctx.stroke();
          }
        } 
      }

    }
    

    
}