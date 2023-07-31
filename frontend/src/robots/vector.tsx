

// ===================================================
export class Vector {

    public static matmul(A:number[][], x: number[]) {
      return A.map((arow: number[], i: number) => arow.reduce((sum:number, a:number, j:number) => sum + arow[j]*x[j],0) )
    }

    public static add(x:number[], y: number[], substract:boolean=false) {
      if (substract) return x.map((_:number,i:number) => x[i] - y[i])
      return x.map((_:number,i:number) => x[i] + y[i])
    }

    public static multiply(x:number[], y: number[]) {
      return x.map((_:number,i:number) => x[i]*y[i])
    }


    public static activation(x:number[], activation: string = 'linear') {
        switch (activation) {
            case 'linear':
                return x.map((_:number,i:number) => x[i])
            case 'relu':
                return x.map((_:number,i:number) => Math.max(x[i],0.0))
            case 'tanh':
                return x.map((_:number,i:number) => Math.tanh(x[i]))
            case 'sigmoid':
                return x.map((_:number,i:number) => Math.tanh(x[i]))
            default:
                return x
            }
    }
}

// ===================================================
interface ILayer {
    units: number
    name: string
}

export class Layer {
    public name: string
    public units: number
    public inputUnits:number = 0

    constructor({units, name = "dense1"}:ILayer) {
        this.name = name;
        this.units = units;
      }
    public build(inputUnits: number) { }
    public loadWeights(weights: any) {}
    public call(x: number[]) {return x}
}

// ===================================================
interface IScaleLayer {
    scale: number[]
    name?: string
}

export class ScaleLayer extends Layer {

  public  inputUnits:number = 0
  private scale: number[] = []

  // ----------------------------------
  constructor({scale, name = "scale1"}: IScaleLayer) {
      super({units: scale.length, name:name});
      this.scale = scale;
  }

  // ----------------------------------
  public build(inputUnits: number) {
    this.inputUnits = inputUnits;
  }

  // ----------------------------------
  public call(x: number[]) {
    return Vector.multiply(x, this.scale);
  }
}

// ===================================================

interface IDenseLayer {
    units: number
    activation:string
    name?: string
}

export class DenseLayer extends Layer { 

  public inputUnits:number = 0
  private activation: string
  private w: number[][] = [[]]
  private b: number[] = []

  // ----------------------------------
  constructor({units, activation, name = "dense1"}:IDenseLayer) {
    super({units: units, name:name});
    
    this.activation = activation
  }

  // ----------------------------------
  public build(inputUnits: number) {
    this.w = Array.from({length: this.units}, (x, i) => Array.from({length: inputUnits}, (x, i) => 0)) ;
    this.b = Array.from({length: this.units}, (x, i) => 0);
    this.inputUnits = inputUnits;
  }

  // ----------------------------------
  public loadWeights(weights: any) {
    if (`${this.name}_w` in weights) {
      console.assert(weights[`${this.name}_w`].length === this.units, `Loaded weights for ${this.name}_w don't match units` )
      console.assert(weights[`${this.name}_w`][0].length === this.inputUnits, `Loaded weights for ${this.name}_w don't match input units` )
      this.w = weights[`${this.name}_w`]
      console.log(`Weights loaded for ${this.name}_w`)
    }
    if (`${this.name}_b` in weights) {
      console.assert(weights[`${this.name}_b`].length === this.units, `Loaded weights for ${this.name}_b don't match units` )
      this.b = weights[`${this.name}_b`]
      console.log(`Weights loaded for ${this.name}_b`)
    }
  }

  // ----------------------------------
  public call(x: number[]) {
    return Vector.activation(Vector.add(Vector.matmul(this.w, x), this.b), this.activation)
  }

}

// ===================================================
interface IModel {
    inputUnits: number
    layers:Layer[]
    name?: string
}

export class Model {

    public name: string
    public layers: Layer[] = [];
    public inputUnits: number

    // ----------------------------------
    constructor({inputUnits, layers, name = "model"}: IModel ) {  
      this.name = name;
      this.inputUnits = inputUnits;
      this.layers = [...layers]
      var i = inputUnits;
    
      for (let n = 0 ; n<layers.length ; n++) {
        this.layers[n].build(i);
        i = this.layers[n].units
      }
      
    }

    // ----------------------------------
    public loadWeights(weights:any) {
      this.layers.forEach((l:Layer) => l.loadWeights(weights));
    }

    // ----------------------------------
    public predict(x: number[]) {
      console.assert(x.length === this.inputUnits, `Input doesn't match input!`)

      var y = [...x];
      for (let n = 0 ; n<this.layers.length ; n++) {
        y = [...this.layers[n].call(y)];
      }

      return y

    }
    // ----------------------------------
    public summary() {
        console.log("===================================")
        console.log(` Summary for model: ${this.name}`)
        console.log("===================================")


        for (let n = 0 ; n<this.layers.length ; n++) {
          console.log(`${this.layers[n].name}: Input ${this.layers[n].inputUnits} => Output ${this.layers[n].units}`  );
        }
  
      }
    
} 