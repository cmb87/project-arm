import React, { useRef, useEffect, useState } from 'react'
import Badge from '../components/Badge';
import InputFieldSlim from '../components/InputFieldSlim';
import Heading from '../components/Heading';
import Button from '../components/Button';

import { DeltaRobot } from '../components/deltaRobot';



interface IPlotRobot {
    robot: DeltaRobot
    xaxis: number
    yaxis: number
    xcursor: number[]
    setXcursor: Function
    update: boolean
}


export default function PlotRobot({robot, xaxis, yaxis, xcursor, setXcursor, update}: IPlotRobot) {

  //e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0
  //const robot = // e,f,re,rf

  const canvas  = useRef<HTMLCanvasElement | null>(null);


  
  // --------------------- Load Image -------------------
  useEffect( () => {
    if (canvas.current ) {

      // Get Threshold
      canvas.current!.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
      const ctx = canvas.current.getContext('2d');

      // ---------------------
      // Clear
      ctx!.clearRect(0, 0, ctx!.canvas.width,  ctx!.canvas.height);
      // ---------------------

      plot();
    }
  }, [update])




  // --------------------- Animation -------------------
  function plot() {

    const ctx = canvas.current?.getContext('2d')
    var rect = ctx!.canvas.getBoundingClientRect();
    const ih = rect.height;
    const iw = rect.width;


    const x1 = robot.getOrigin();

    if (ctx) {
      ctx.canvas.width = iw;
      ctx.canvas.height = ih;

      ctx.globalCompositeOperation = "destination-over";
      ctx.clearRect(0, 0, iw, ih); // clear canvas

      ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
      ctx.strokeStyle = "rgba(0, 153, 255, 1.0)";

      robot.plot(ctx, iw, ih, xaxis, yaxis);

    }
  }

  // --------------------- GetRelativeMousePos -------------------
  const _getRelativeMousePos = (ex:number,ey:number) => {
    const ctx = canvas.current?.getContext('2d')
    if (ctx != null) {
      var rect = ctx.canvas.getBoundingClientRect();
      return {
        x: (ex-rect.left)/ rect.width,
        y: (ey-rect.top)/ rect.height
      }
    }
  }
  // --------------------- GetMouseCursor -------------------
  const hoverCb = (ex:number,ey:number, btn: number) => {
    
    const m = _getRelativeMousePos(ex, ey)
    let x = [0,0.5,0.16];
    x[xaxis] = m!.x;
    x[yaxis] = m!.y;

    setXcursor(x);
    
  } 

  return (

      <canvas 
          ref={canvas}
          width={300}
          height={300}
          style={{ cursor: 'crosshair'}} // backgroundImage: , `url(${imageUrl})`, backgroundSize: "100% 100%" 
          onMouseDown={(e) => hoverCb(e.clientX, e.clientY, e.button)}
          //onMouseUp={(e) => clickBtnUpCb(e.clientX, e.clientY, e.button)}
          //onMouseLeave={(e) => {setAnnotationSelected(null)}}
          onMouseMove={(e) => hoverCb(e.clientX, e.clientY, e.button)}
          className="w-full"
        />

  )
}
