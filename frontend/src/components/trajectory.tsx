interface ITrajectoryPoint {
    xt: number[]
    parameters: number[][]
    eta: number
    pos: number[]
}


export class Trajectory {
  
    private tstart: number = 0;
    private traj: ITrajectoryPoint[] = []

    // -----------------------------------------------
    constructor() {
      // Assign dummy values
    }

    // -----------------------------------------------
    public addPoints(xf: number[], pos: number[], Tf: number) {

      // If Trajectory is still empty
      if (this.traj.length === 0) {
        this.traj.push({
            xt: xf, 
            parameters: [[0]], 
            eta: 0,
            pos: pos
        }) 
        return
      }

      // Add a new point, Tf time for move in Seconds
      this.traj.push({
        xt: xf, 
        parameters: Trajectory._calculate(this.traj[this.traj.length-1].xt, xf, Tf),
        eta: this.traj[this.traj.length-1].eta+Tf,
        pos: pos
       });

    };

    // -----------------------------------------------
    private static _calculate(x0: number[], xf: number[], Tf: number) {
        const a0 =  x0;
        const a1 =  x0.map((x:number, idx:number) =>  0.0);
        const a2 =  x0.map((x:number, idx:number) =>  3.0/(Tf*Tf)*(xf[idx]-x0[idx])); 
        const a3 =  x0.map((x:number, idx:number) => -2.0/(Tf*Tf*Tf)*(xf[idx]-x0[idx])); 
        return [a0, a1, a2, a3];
    };

    // -----------------------------------------------
    public init(x0:number[]) {
        this.traj = []; // delete everything
    }

    // -----------------------------------------------
    public start() {
      //  time stamp is the number of milliseconds that have passed since January 1, 1970
      this.tstart = new Date().getTime()/1000; // in seconds
    }

    // -----------------------------------------------
    public getJointTarget() {

      const t = new Date().getTime()/1000 - this.tstart;
      
      const trCurr = this.traj.filter((tr:ITrajectoryPoint) => tr.eta<=t)[0]

      // Loop over each dimension and calculate the polynomial a0 + a1*t + a2*t**2 + a3*t**3
      const xtarget = trCurr.xt.map((x:number,idx:number) => trCurr.parameters.reduce((sum:number, a:number[], idx:number) => (sum + a[idx])*Math.pow(t, idx), 0))

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