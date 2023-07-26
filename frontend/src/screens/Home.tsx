import React, { useRef, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import Badge from '../components/Badge';
import InputFieldSlim from '../components/InputFieldSlim';
import Heading from '../components/Heading';
import Button from '../components/Button';

import { DeltaRobot } from '../components/deltaRobot';


export default function GeoTag() {

  const navigate = useNavigate();
  const canvas  = useRef<HTMLCanvasElement | null>(null);
  const [hover, setHover] = useState<{x: number[], label: string | undefined}>({x: [0,0], label:undefined})

  

  //e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0
  const robot = new DeltaRobot(0.115, 0.457, 0.232, 0.112, 0.5, 0.0, 0.5) // e,f,re,rf

  const [x0, setX0]  = useState<{status: number, x0: number[]} | -1>( robot.forwardKinematic(0.0, 0.0, 0.0) );
  const [joints, setJoints]  = useState<{status: number, jointAngles: number[]} | -1>( {status: 0, jointAngles: [0.0,0.0,0.0]} );

  console.log(x0)

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

      draw();
    }
  }, [])




  // --------------------- Animation -------------------
  function draw() {

    const ctx = canvas.current?.getContext('2d')
    var rect = ctx!.canvas.getBoundingClientRect();
    const ih = rect.height;
    const iw = rect.width;

    const x1 = robot.getOrigin();

    if (ctx) {

      ctx.globalCompositeOperation = "destination-over";
      ctx.clearRect(0, 0, 300, 300); // clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
    //   ctx.save();

    //   ctx.translate(150, 150);
    
    //   // Earth
    //   const time = new Date();
    //   ctx.rotate(
    //     ((2 * Math.PI) / 60) * time.getSeconds() +
    //       ((2 * Math.PI) / 60000) * time.getMilliseconds(),
    //   );
    //   ctx.translate(105, 0);
    //   ctx.fillRect(0, -12, 40, 24); // Shadow
    // // ctx.drawImage(earth, -12, -12);
    
    //   // Moon
    //   ctx.save();
    //   ctx.rotate(
    //     ((2 * Math.PI) / 6) * time.getSeconds() +
    //       ((2 * Math.PI) / 6000) * time.getMilliseconds(),
    //   );
    //   ctx.translate(0, 28.5);
    // //  ctx.drawImage(moon, -3.5, -3.5);
    //   ctx.restore();
    
    //   ctx.restore();
    
    //   ctx.beginPath();
    //   ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    //   ctx.stroke();
    
      ctx.beginPath();
      ctx.fillRect(Math.floor(x1.x1[0]*iw), Math.floor(x1.x1[2]*ih),10,10); // fill in the pixel at (10,10)
      ctx.stroke();

      window.requestAnimationFrame(draw);
  }
  }

  // --------------------- GetRelativeMousePos -------------------
  const _getRelativeMousePos = (ex:number,ey:number) => {
    const ctx = canvas.current?.getContext('2d')
    if (ctx != null) {
      var rect = ctx.canvas.getBoundingClientRect();
      return {
        x: (ex-rect.left),/// rect.width,
        y: (ey-rect.top)/// rect.height
      }
    }
  }
  // --------------------- GetMouseCursor -------------------
  const hoverCb = (ex:number,ey:number, btn: number) => {
    const m = _getRelativeMousePos(ex, ey)

    
    console.log(m)
  } 

  return (
    <div className="flex flex-col gap-4 w-full md:p-2 lg:p-5">

      <Heading title='Manipulator'/>
      {/* ===================================================================== */}
      <div className="w-1/3">
      <canvas 
          ref={canvas}
          width={300}
          height={300}
          style={{ cursor: 'crosshair', backgroundSize: "100% 100%" }} // backgroundImage: , `url(${imageUrl})`
          onMouseDown={(e) => hoverCb(e.clientX, e.clientY, e.button)}
          //onMouseUp={(e) => clickBtnUpCb(e.clientX, e.clientY, e.button)}
          //onMouseLeave={(e) => {setAnnotationSelected(null)}}
          //onMouseMove={(e) => hoverCb(e.clientX, e.clientY)}
          className="w-full"
        />
      </div>
    </div>
  )
}

