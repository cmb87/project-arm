import React, { useRef, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import Badge from '../components/Badge';
import InputFieldSlim from '../components/InputFieldSlim';
import Heading from '../components/Heading';
import Button from '../components/Button';
import PlotRobot from '../components/PlotRobot';
import PlotTimeseries from '../components/PlotTimeseries';

import { DeltaRobot } from '../components/deltaRobot';

const r = new DeltaRobot(0.115, 0.357, 0.332, 0.132, 0.5, 0.5, 0.5)

const NMAX: number = 100;


export default function Home() {

  //e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0
  //const robot = // e,f,re,rf

  const navigate = useNavigate();
  const [robot, setRobot] = useState( r )
  const [xcursor, setXcursor] = useState([0.5,0.5,0.5])
  const [update, setUpdate] = useState(true)

  const [thetaTs, setThetaTs] = useState<{t: number, theta: number, id: number}[]>([])

  // --------------------- Load Image -------------------
  useEffect( () => {

    const thetaUpdate = robot.inverseKinematic(xcursor[0], xcursor[1], xcursor[2]);

    if (thetaUpdate.status === 0 ) {
      robot.forwardKinematic(
        thetaUpdate.jointAngles[0],
        thetaUpdate.jointAngles[1],
        thetaUpdate.jointAngles[2]
      );
      robot.calculateGeometry();
      setUpdate(!update);

      if (thetaTs.length > 3*NMAX) thetaTs.shift();thetaTs.shift();thetaTs.shift();

      const t = new Date().getTime();
      thetaTs.push({t: t, theta: thetaUpdate.jointAngles[0], id: 1})
      thetaTs.push({t: t, theta: thetaUpdate.jointAngles[1], id: 2})
      thetaTs.push({t: t, theta: thetaUpdate.jointAngles[2], id: 3})
        
    }

  }, [xcursor])


  
  return (
    <div className="flex flex-col gap-4 w-full md:p-2 lg:p-5">

      <Heading title='Manipulator'/>

      <div className="grid grid-cols-2 gap-4 w-1/2">
      {/* ===================================================================== */}
        <div className="border border-gray-300 rounded-xl">
          <PlotRobot robot={robot} xaxis={0} yaxis={2} xcursor={xcursor} setXcursor={setXcursor} update={update}/>
        </div>
        <div className="border border-gray-300 rounded-xl">
          <PlotRobot robot={robot} xaxis={1} yaxis={2} xcursor={xcursor} setXcursor={setXcursor} update={update}/>
        </div>
        <div className="border border-gray-300 rounded-xl">
          <PlotRobot robot={robot} xaxis={0} yaxis={1} xcursor={xcursor} setXcursor={setXcursor} update={update}/>
        </div>

        <div className=" p-5">
          <PlotTimeseries data={thetaTs} update={update}/>
        </div>
      </div>
    </div>
  )
}

