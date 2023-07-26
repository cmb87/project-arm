
// https://hypertriangle.com/~alex/delta-robot-tutorial/


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
    private  tan30: number = 1/this.sqrt3;

    // -----------------------------------------------
    constructor(e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0) {
      this.e = e;     // end effector
      this.f = f;     // base
      this.re = re;
      this.rf = rf;

      this.xoff = xoff;
      this.yoff = yoff;
      this.zoff = zoff;
      console.log("robot active")
    }

    // -----------------------------------------------
    public getOrigin() {
      return {x1: [this.xoff,this.yoff,this.zoff]}
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
  
      const z0: number = -0.5*(b+Math.sqrt(d))/a;
      const x0: number = (a1*z0 + b1)/dnm;
      const y0: number = (a2*z0 + b2)/dnm;


      return {status: 0, x0: [x0+this.xoff, y0+this.yoff, z0+this.zoff]}
    }

    // -----------------------------------------------
    private delta_calcAngleYZ(x0: number, y0: number, z0: number) {

      let theta: number = 0.0;

      const y1: number = -0.5 * 0.57735 * this.f; // f/2 * tg 30
      y0 -= 0.5 * 0.57735 * this.e;    // shift center to edge
      // z = a + b*y
      const a: number = (x0*x0 + y0*y0 + z0*z0 +this.rf*this.rf - this.re*this.re - y1*y1)/(2*z0);
      const b: number = (y1-y0)/z0;
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


    
}