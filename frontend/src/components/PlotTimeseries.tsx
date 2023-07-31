import React, {useEffect, useState} from 'react';
import {Vega} from 'react-vega';
import { VegaLite, View } from 'react-vega';
import { StandardType } from 'vega-lite/build/src/type';
import {VisualizationSpec} from "vega-embed";
import * as vega from 'vega';

//import { BsArrowBarDown, BsArrowBarUp } from 'react-icons/bs';

import { InputFieldSelectSlim } from './InputFieldSlim';
import Button from './Button';
import { DeltaRobot } from '../robots/deltaRobot';

// ----------------------------------------------
interface IScatterPlot {
  robot: DeltaRobot | undefined
  update:boolean | number
  data: any
}

// https://www.colamda.de/blog/2020-12-03-React-Vega-Lifecycle/
// https://vega.github.io/vega-lite/tutorials/streaming.html

export default function ScatterPlotGeneric({robot, update }:IScatterPlot) {
  const [view, setView] = useState<View>();
  const width = "container"
  const height = 200

  useEffect(() => {
    if (!robot && !view) return

    const updateGraph = () => {
      const cs = vega
        .changeset()
        .insert(robot!.jointStatesHist)
        .remove(function (t:any) {
            return t.t < robot!.jointStatesHist[0].t;
          });

      view!.change('table', cs).run();
    }


    updateGraph();

  }, [update]);



  const specLinePlot: any ={
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": `Theta Time Series`,
    "width": width,
    "height": height,
    "data": {"name": "table"},


    "mark": {"type": "line"},

    "encoding": { 
      "x": {
        "field": `t`,
        "type": "temporal",
        "title": "Time",
        //"timeUnit": "seconds",
      },
      "y": {
        "field": `theta`,
        "type": "quantitative",
        "title": "Theta"
      },
      "color": {"field": "id", "type": "nominal"}
    },
    // "selection": {
    //   "grid_x": {
    //     "type": "interval",
    //     "bind": "scales",
    //     "zoom": "wheel![event.ctrlKey]",
    //     "encodings": ["x"]
    //   },
    //   "grid_y": {
    //     "type": "interval",
    //     "bind": "scales",
    //     "zoom": "wheel![!event.ctrlKey]",
    //     "encodings": ["y"]
    //   }
    // },
    "config": {
      "axis": {"grid": true, "tickBand": "extent"}
    }
  }



  return (


    <div className="flex flex-col">
      { robot && <Vega data={{table:robot!.jointStatesHist}}  spec={specLinePlot} actions={true} onNewView={(view:any) => setView(view)} renderer={'svg'}/>}
    </div>




  )
}
