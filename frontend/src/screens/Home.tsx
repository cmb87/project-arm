import React, { useRef, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import Badge from '../components/Badge';
import InputFieldSlim from '../components/InputFieldSlim';
import Heading from '../components/Heading';
import Button from '../components/Button';
import PlotRobot from '../components/PlotRobot';
import PlotTimeseries from '../components/PlotTimeseries';

import { DeltaRobot } from '../components/deltaRobot';



const NMAX: number = 200;


export default function Home() {

  //e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0
  //const robot = // e,f,re,rf

  const navigate = useNavigate();
  const [robot, setRobot] = useState<DeltaRobot>( )
  const [xcursor, setXcursor] = useState<number[]>([])
  const [update, setUpdate] = useState(true)
  const [waypoint, setWaypoint] = useState(true)

  const [thetaTs, setThetaTs] = useState<{t: number, theta: number, id: number}[]>([])

  
  // --------------------- Build robot -------------------
  useEffect(() => {

    const r = new DeltaRobot(0.115, 0.357, 0.332, 0.132, 0.5, 0.5, 0.5)
    const x0 = r.forwardKinematic(0.0,0.0,0.0);
    r.calculateGeometry();

    if (x0 !== -1) {
      setXcursor(x0.x);
    }

    setRobot(r);

  }, [])

  // --------------------- Update robot geometry based on cursor move -------------------
  useEffect( () => {

    if (!robot) return
    const thetaUpdate = robot!.inverseKinematic(xcursor[0], xcursor[1], xcursor[2]);
    if (thetaUpdate.status !== 0 ) return 


    robot!.forwardKinematic(
      thetaUpdate.jointAngles[0],
      thetaUpdate.jointAngles[1],
      thetaUpdate.jointAngles[2]
    );
    robot!.calculateGeometry();
    setUpdate(!update);

    // Remove old entries
    if (thetaTs.length > 3*NMAX) thetaTs.shift();thetaTs.shift();thetaTs.shift();

    // Add new
    const t = new Date().getTime();
    thetaTs.push({t: t, theta: thetaUpdate.jointAngles[0], id: 1})
    thetaTs.push({t: t, theta: thetaUpdate.jointAngles[1], id: 2})
    thetaTs.push({t: t, theta: thetaUpdate.jointAngles[2], id: 3})
      
 
  }, [xcursor])
  // --------------------- Add waypoint -------------------
  useEffect(()=>{
    if (!robot) return
    const thetaUpdate = robot!.inverseKinematic(xcursor[0], xcursor[1], xcursor[2]);
    if (thetaUpdate.status !== 0 ) return 

    robot?.trajectory.addPoints(thetaUpdate.jointAngles, xcursor, 10);
    console.log("Waypoint added")

  }, [waypoint])
    

  // --------------------- ------------------
  return (
    <div className="flex flex-col gap-4 w-full md:p-2 lg:p-5">

      <Heading title='Manipulator'/>

      <div className="border border-gray-300 rounded-xl p-5">
        <PlotTimeseries data={thetaTs} update={update}/>
      </div>

      <div className="grid grid-cols-2 gap-4 w-1/2">
      {/* ===================================================================== */}
        <div className="border border-gray-300 rounded-xl">
          {robot && <PlotRobot robot={robot} xaxis={0} yaxis={2} xcursor={xcursor} setXcursor={setXcursor} update={update} waypointSetTrigger={()=> setWaypoint(!waypoint)} />}
        </div>
        <div className="border border-gray-300 rounded-xl">
          {robot &&<PlotRobot robot={robot} xaxis={1} yaxis={2} xcursor={xcursor} setXcursor={setXcursor} update={update} waypointSetTrigger={()=> setWaypoint(!waypoint)} />}
        </div>
        <div className="border border-gray-300 rounded-xl">
          {robot &&<PlotRobot robot={robot} xaxis={0} yaxis={1} xcursor={xcursor} setXcursor={setXcursor} update={update} waypointSetTrigger={()=> setWaypoint(!waypoint)} />}
        </div>


      </div>
    </div>
  )
}

