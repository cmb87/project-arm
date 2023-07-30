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
  const [update, setUpdate] = useState<boolean | number>(true)
  const [waypoint, setWaypoint] = useState(true)
  const [simlating, setSimulating] = useState(false)

  const [thetaTs, setThetaTs] = useState<{t: number, theta: number, id: number}[]>([])

  
  // --------------------- Build robot -------------------
  useEffect(() => {

    const r = new DeltaRobot(0.115, 0.357, 0.332, 0.132, 0.5, 0.5, 0.5)
    const x0 = r.forwardKinematic(0.0,0.0,0.0);
    r.calculateGeometry();

    if (x0 !== -1) {
      r.trajectory.init([0.0,0.0,0.0], [...x0.x] );
      setXcursor(x0.x);
    }

    console.log("New robot initialized")
    setRobot(r);

  }, [])

  // --------------------- Update robot geometry based on cursor move -------------------
  useEffect( () => {


    if (!robot) return
    const thetaCursor = robot!.inverseKinematic(xcursor[0], xcursor[1], xcursor[2]);
    if (thetaCursor.status !== 0 ) return 

    setUpdate(!update);


    // if (!robot) return
    // const thetaUpdate = robot!.inverseKinematic(xcursor[0], xcursor[1], xcursor[2]);
    // if (thetaUpdate.status !== 0 ) return 


    // robot!.forwardKinematic(
    //   thetaUpdate.jointAngles[0],
    //   thetaUpdate.jointAngles[1],
    //   thetaUpdate.jointAngles[2]
    // );
    // robot!.calculateGeometry();
    // setUpdate(!update);

    // // Remove old entries
    // if (thetaTs.length > 3*NMAX) thetaTs.shift();thetaTs.shift();thetaTs.shift();

    // // Add new
    // const t = new Date().getTime();
    // thetaTs.push({t: t, theta: thetaUpdate.jointAngles[0], id: 1})
    // thetaTs.push({t: t, theta: thetaUpdate.jointAngles[1], id: 2})
    // thetaTs.push({t: t, theta: thetaUpdate.jointAngles[2], id: 3})
      
 
  }, [xcursor])

  // --------------------- Add waypoint -------------------
  useEffect(()=>{

    if (!robot) return
    const thetaCursor = robot!.inverseKinematic(xcursor[0], xcursor[1], xcursor[2]);
    if (thetaCursor.status !== 0 ) return 
    robot?.trajectory.addPoints(thetaCursor.jointAngles, [...xcursor], 0.5);
    setUpdate(!update);

  }, [waypoint])

  // --------------------- ------------------

  const simulate = async (dt: number=0.1) => {
    if (simlating) return
    if (!robot) return

    setSimulating(true);

    const nmax = Math.ceil(robot.trajectory.getTotalTime()/dt);

    console.log("Running Simulation", nmax)

    for (var n = 0; n < nmax; n++) {

      const t = n*dt;
      const theta = robot.trajectory.getJointTarget(t);

      //console.log(theta);
      robot.forwardKinematic(theta[0], theta[1], theta[2]);
      robot.calculateGeometry();

      // Remove old entries
      if (thetaTs.length > 3*NMAX) thetaTs.shift();thetaTs.shift();thetaTs.shift();

      thetaTs.push({t: t, theta: theta[0], id: 1})
      thetaTs.push({t: t, theta: theta[1], id: 2})
      thetaTs.push({t: t, theta: theta[2], id: 3})

      setUpdate(n);

      await new Promise(r => setTimeout(r, Math.round(dt*1000)));
      
    }

    setSimulating(false);
    console.log("Done")

  }

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
        <div className="border border-gray-300 rounded-xl">
          <Button onClick={()=> simulate()} disabled={simlating} title='Start Simulation'></Button>
        </div>
      </div>
    </div>
  )
}

