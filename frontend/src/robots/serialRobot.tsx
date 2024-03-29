import { Trajectory } from "./trajectory";
import { Vector, Model, DenseLayer, ScaleLayer } from "./vector";
import weights from '../assets/weight2s.json';

// const model = new Model(
//   {inputUnits:3, layers:[
//     new ScaleLayer({scale: [1/1.4, 1/1.4, 1/3.14159]}),
//     new DenseLayer({units: 120, activation: "relu", name: "dense"}),
//     new DenseLayer({units: 3, activation: "tanh", name:"dense_1"}),
//   ], name:"model"
// })

// model.summary()
// model.loadWeights(weights)

// const theta = model.predict([1.0,0.5,0.0])



export interface IXCinematic {
  base: number[][][]
  endeffector: number[][][]
  joints: number[][][]
}


export class SerialRobot {


    private xoff: number[]
    private scale: number

    private  pi: number = 3.141592653;    // PI

    // IK modell
    public ikModel: any;

    public jointLength: number[] = [];
    public nJoints: number
    private xe: number[] = [0,0,0,0];

    private jointStates: number[] = [0,0,0,0];
    private jointStatesMin: number[] = [-this.pi, 0, -this.pi, -this.pi/2]
    private jointStatesMax: number[] = [ this.pi, this.pi, 0,  this.pi/2]

    // For plotting joint state history
    public jointStatesHist: {t: number, theta: number, id: string}[] = [];
    public maxHistSteps: number= 300

    // Just for plotting
    private xCinematic: IXCinematic = {base: [], endeffector: [], joints: []}
    public trajectory: Trajectory
    

    // -----------------------------------------------
    constructor(
      jointLength: number[],
      xoff: number[] = [0.5,0.5,0.5],
      scale: number = 1.0,
      jointStatesMin: number[]| undefined = undefined,
      jointStatesMax: number[]| undefined = undefined
    ) {
      // Convention: All jointAngles are in radiants!

      this.xoff = xoff;
      this.scale = scale;

      this.jointLength = jointLength
      this.nJoints = jointLength.length

      this.trajectory = new Trajectory();

      this.jointStatesMax = jointStatesMax ? jointStatesMax : this.jointStatesMax;
      this.jointStatesMin = jointStatesMin ? jointStatesMin : this.jointStatesMin;

      this.createIKModel();

      console.log("New Robot created")
    }


    // -----------------------------------------------
    public forwardKinematic(jointStates: number[]) {

      const thetaRot = jointStates[0]
  
      const tril = Vector.tril(this.nJoints)
      const jointSum: number[] = Vector.matmul(tril, jointStates.slice(1))

      const r: number[] = Vector.matmul(tril, Vector.multiply(Vector.activation(jointSum,"cos"), this.jointLength)  )
      const z: number[] = Vector.matmul(tril, Vector.multiply(Vector.activation(jointSum,"sin"), this.jointLength)  )

      const x: number[] = r.map((v:number) => v*Math.cos(thetaRot));
      const y: number[] = r.map((v:number) => v*Math.sin(thetaRot));


      // Store internally
      this.xe = [x[x.length-1], y[x.length-1], z[x.length-1], jointSum[x.length-1]]
      this.jointStates = [...jointStates]


      this.xCinematic = {
        base: [[
          Vector.normalize([-0.1,0,0], this.xoff, this.scale, true),
          Vector.normalize([+0.1,0,0], this.xoff, this.scale, true)
        ],
        [
          Vector.normalize([0,-0.1,0], this.xoff, this.scale, true),
          Vector.normalize([0,+0.1,0], this.xoff, this.scale, true)
        ]], 
        endeffector: [[
          Vector.normalize([x[x.length-1],y[x.length-1], z[x.length-1]], this.xoff, this.scale, true),
          Vector.normalize([x[x.length-2],y[x.length-2], z[x.length-2]], this.xoff, this.scale, true),
        ]], 
        joints: this.jointLength.map((_:number,idx:number) => idx === 0 ?
         [
          Vector.normalize([0,0,0], this.xoff, this.scale, true),
          Vector.normalize([x[idx],y[idx],z[idx]], this.xoff, this.scale, true),
        ]:
        [
          Vector.normalize([x[idx-1],y[idx-1],z[idx-1]], this.xoff, this.scale, true),
          Vector.normalize([x[idx],y[idx],z[idx]], this.xoff, this.scale, true),
        ] )
      }


      return {status: 0, x: Vector.normalize([x[x.length-1],y[x.length-1], z[x.length-1]], this.xoff, this.scale, true)}

    }

    // -----------------------------------------------
    public createIKModel() {

      this.ikModel = new Model(
        {inputUnits:3, layers:[
          new ScaleLayer({scale: [1/1.4, 1/1.4, 1/this.pi]}),
          new DenseLayer({units: 120, activation: "relu", name: "dense"}),
          new DenseLayer({units: 3, activation: "tanh", name:"dense_1"}),
        ], name:"model"
      })

      //this.ikModel.summary()
      this.ikModel.loadWeights(weights)
      console.log("IK Model loaded!")
    }
    // -----------------------------------------------
    public inverseKinematic(xstar: number[]) {

      // we must invert z for this robot
      xstar[2] = 1.0-xstar[2]

      const xe = Vector.unnormalize(xstar.slice(0,-1), this.xoff, this.scale);

      const tiltEndeffector = xstar[3];
      const thetaRot = Math.atan2(xe[1],xe[0]);

      const r = Math.sqrt(xe[0]*xe[0] + xe[1]*xe[1]);

      // Call the neural network
      this.jointStates = [
        thetaRot,
        ...Vector.add(
          this.jointStatesMin.slice(1),
          Vector.multiply(this.ikModel.predict([r,xe[2],tiltEndeffector]), Vector.substract(this.jointStatesMax.slice(1), this.jointStatesMin.slice(1)) ))
      ]
      
      const error = this.forwardKinematic(this.jointStates).x.reduce((sum:number,xfstar:number,idx:number) => sum+(xfstar-xstar[idx])*(xfstar-xstar[idx]),0)

      return {status: 0, jointAngles: this.jointStates, mse: error}
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
    public calculateGeometry() {}

    // -----------------------------------------------
    public plot(ctx: CanvasRenderingContext2D, iw: number, ih: number, xaxis: number=0, yaxis: number= 2) {

      
      const component: string[] = ["base", "endeffector", "joints"];
      const colors = {
        base: "rgba(10, 10, 10, 1.0)",
        endeffector: "rgba(0, 0, 0, 1.0)",
        joints: "rgba(165, 165, 165, 1.0)"
      }

      const xe = this.xCinematic["endeffector" as keyof typeof this.xCinematic][0][0]

      // -----------------------------------------
      if (yaxis == 2) {
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fillRect(
        0,
        0,
        iw,
        (1-this.xoff[2])*ih  
      );

      ctx.fillStyle = "rgba(128,0,0, 0.2)";
      ctx.fillRect(
        0,
        (1-this.xoff[2])*ih,
        iw,
        ih  
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
      ctx.setLineDash([10, 15]);
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
          (xe[xaxis])*iw
        ),
        ih
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        0,
        Math.floor(
          (xe[yaxis])*ih  
        ),
      );
      ctx.lineTo(
        iw,
        Math.floor(
          (xe[yaxis])*ih  
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
                (x[i][j][xaxis])*iw  
              ),
              Math.floor(
                (x[i][j][yaxis])*ih
              )
            );
            ctx.lineTo(
              Math.floor(
                (x[i][j+1][xaxis])*iw
              ),
              Math.floor(
                (x[i][j+1][yaxis])*ih
              )
            );

            ctx.fillRect(
              Math.floor((x[i][j][xaxis])*iw )-5,
              Math.floor((x[i][j][yaxis])*ih )-5,
              10,10
            );
            ctx.fillRect(
              Math.floor((x[i][j+1][xaxis])*iw )-5,
              Math.floor((x[i][j+1][yaxis])*ih )-5,
              10,10
            );
            
            ctx.stroke();
          }
        } 
      }

    }
    

    
}