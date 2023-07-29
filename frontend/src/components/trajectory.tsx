interface ITrajectoryPoint {
    xt: number[]
    parameters: number[][]
    eta: number
}


export class Trajectory {
  

    private tstart: number = 0;

    private traj: ITrajectoryPoint[] = []

    // -----------------------------------------------
    constructor(x0: number[]) {
      // Assign dummy values
      this.traj.push({xt: x0, parameters: [[0]], eta: 0});
    }

    // -----------------------------------------------
    public addPoints(xf: number[], Tf: number) {
      // Tf time for move in Seconds
      this.traj.push({
        xt: xf, 
        parameters: Trajectory._calculate(this.traj[-1].xt, xf, Tf),
        eta: this.traj[-1].eta+Tf
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
    public start() {
      //  time stamp is the number of milliseconds that have passed since January 1, 1970
      this.tstart = new Date().getTime()/1000; // in seconds
    }

    // -----------------------------------------------
    public getJointTarget() {
      const t = new Date().getTime()/1000 - this.tstart;
      
      this.traj.filter((tr:ITrajectoryPoint) => tr.eta<=t)[0]

    }



}