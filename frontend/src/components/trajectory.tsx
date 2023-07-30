interface ITrajectoryPoint {
    xt: number[]
    parameters: number[][]
    t0: number
    t1: number
    pos: number[]
}


export class Trajectory {
  
    private tstart: number = 0;
    private traj: ITrajectoryPoint[] = []
    private njoints: number = 0;

    // -----------------------------------------------
    constructor() {
      // Assign dummy values
    }
    // -----------------------------------------------
    public getTotalTime() {
        return this.traj[this.traj.length-1].t1
    }
    // -----------------------------------------------
    public addPoints(xf: number[], pos: number[], Tf: number) {

      // Add a new point, Tf time for move in Seconds
      const x0 = [...this.traj[this.traj.length-1].xt];
      this.traj.push({
        xt: xf, 
        parameters: Trajectory._calculate(xf,x0, Tf),
        pos: pos,
        t1: this.traj[this.traj.length-1].t1+Tf,
        t0: this.traj[this.traj.length-1].t1
       });

    };

    // -----------------------------------------------
    private static _calculate(xf: number[], x0: number[], Tf: number) {
        const a0 =  x0;
        const a1 =  x0.map((x:number, idx:number) =>  0.0);
        const a2 =  x0.map((x:number, idx:number) =>  3.0/(Tf*Tf)*(xf[idx]-x0[idx])); 
        const a3 =  x0.map((x:number, idx:number) => -2.0/(Tf*Tf*Tf)*(xf[idx]-x0[idx])); 
        return [a0, a1, a2, a3];
    };

    // -----------------------------------------------
    public init(x0:number[], pos0: number[]) {
        this.traj = []; // delete everything
        this.traj.push({
            xt: x0, 
            parameters: [[0]], 
            t1: 0,
            t0: 0,
            pos: pos0
        })
        this.tstart = 0;
        this.njoints = x0.length;
    }


    // -----------------------------------------------
    public getJointTarget(t:number) {



      const trCurr = this.traj.filter((tr:ITrajectoryPoint) => tr.t1>(t-this.tstart))[0]
      // Loop over each dimension and calculate the polynomial a0 + a1*t + a2*t**2 + a3*t**3
      
      const dt = (t-this.tstart)-trCurr.t0;

      var xtarget = new Array(this.njoints);
      

      for (var i=0 ; i<this.njoints; i++ ) {
        xtarget[i] = trCurr.parameters[0][i] + trCurr.parameters[1][i]*dt + trCurr.parameters[2][i]*dt*dt + trCurr.parameters[3][i]*dt*dt*dt; 
      }
      
      //const xtarget = trCurr.parameters.reduce((sum:number, arow:number[],idx:number) => arow.map((a:number) => a*Math.pow((t-this.tstart), idx), 0)
      //trCurr.parameters.reduce((sum:number, a:number[], idx:number) => (sum + a[idx1])*Math.pow((t-this.tstart), idx), 0))

      return xtarget
    }
    // -----------------------------------------------
    public plot(ctx: CanvasRenderingContext2D, iw: number, ih: number, xaxis: number=0, yaxis: number= 2) {

        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
        ctx.fillStyle = "rgba(150, 150, 150, 1.0)";

        for (var i = 0; i < this.traj.length-1; i++) {
            ctx.beginPath();
            ctx.moveTo(
              Math.floor(
                (this.traj[i].pos[xaxis])*iw  
              ),
              Math.floor(
                (this.traj[i].pos[yaxis])*ih
              )
            );
            ctx.lineTo(
              Math.floor(
                (this.traj[i+1].pos[xaxis])*iw
              ),
              Math.floor(
                (this.traj[i+1].pos[yaxis])*ih
              )
            );
            ctx.fillRect(
              Math.floor((this.traj[i].pos[xaxis])*iw )-5,
              Math.floor((this.traj[i].pos[yaxis])*ih )-5,
              10,10
            );
            ctx.fillRect(
              Math.floor((this.traj[i+1].pos[xaxis])*iw )-5,
              Math.floor((this.traj[i+1].pos[yaxis])*ih )-5,
              10,10
            );

            ctx.stroke();
        }
        // -----------------------------------------

      }



}