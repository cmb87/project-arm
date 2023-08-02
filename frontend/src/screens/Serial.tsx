import React, { useRef, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import Badge from '../components/Badge';
import InputFieldSlim from '../components/InputFieldSlim';
import Heading from '../components/Heading';
import Button from '../components/Button';
import PlotRobot from '../components/PlotRobot';
import PlotTimeseries from '../components/PlotTimeseries';

import { SerialRobot } from '../robots/serialRobot';




export default function Serial() {

  //e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0
  //const robot = // e,f,re,rf

  const navigate = useNavigate();
  const [robot, setRobot] = useState<SerialRobot>( )
  const [xcursor, setXcursor] = useState<number[]>([])
  const [update, setUpdate] = useState<boolean | number>(true)
  const [waypoint, setWaypoint] = useState(true)
  const [simlating, setSimulating] = useState(false)

  const [thetaTs, setThetaTs] = useState<{t: number, theta: number, id: number}[]>([])

  
  // --------------------- Build robot -------------------
  useEffect(() => {


    //thetaMin = tf.constant([0, -PI, -PI/2], dtype=tf.float32)
    //thetaMax = tf.constant([PI, 0,  PI/2], dtype=tf.float32)

    const r = new SerialRobot([0.5,0.6,0.3], [0.5, 0.5, 0.2], 2.8)
    const x0 = r.forwardKinematic([0,0,0,0]);

    if (x0.status !== -1) {
      r.trajectory.init([0.0,0.0,0.0,0.0], [...x0.x,0.0] );
      setXcursor(x0.x);
    }

    console.log("New serial robot initialized")
    setRobot(r);

  }, [])

  // --------------------- Update robot geometry based on cursor move -------------------
  useEffect( () => {


    if (!robot) return
    const thetaCursor = robot!.inverseKinematic([xcursor[0], xcursor[1], xcursor[2], 0.0]);
    if (thetaCursor.status !== 0 ) return 

    setUpdate(!update);


  }, [xcursor])

  // --------------------- Add waypoint -------------------
  useEffect(()=>{

    if (!robot) return
    const thetaCursor = robot!.inverseKinematic([xcursor[0], xcursor[1], xcursor[2], 0.0]);

    if (thetaCursor.status !== 0 ) return 
    robot?.trajectory.addPoints(thetaCursor.jointAngles, [...xcursor,0.0], 1000);
    setUpdate(!update);

  }, [waypoint])

  // --------------------- ------------------
  // Start a simulation
  const simulate = async (dt: number=100) => {
    if (simlating) return
    if (!robot) return

    setSimulating(true);

    await robot.run(100, setUpdate)   
    
    setSimulating(false);
  }


  // --------------------- ------------------
  // reset
  const reset = async (dt: number=100) => {
    if (simlating) return
    if (!robot) return

    robot.trajectory.init(robot.getCurrentJointStates(), robot.getCurrentEndEffectorPosition());
    setUpdate(new Date().getTime());
  }


  // --------------------- ------------------
  return (
    <div className="flex flex-col gap-4 w-full md:p-2 lg:p-5">

      <Heading title='Manipulator'/>

      <div className="border border-gray-300 rounded-xl p-5">
        <PlotTimeseries robot={robot} data={thetaTs} update={update}/>
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
        <div className="border border-gray-300 rounded-xl p-5">
          <Button onClick={()=> simulate()} disabled={simlating} title='Start Simulation'></Button>
          <Button onClick={()=> reset()} disabled={simlating} title='Reset'></Button>
        </div>
      </div>
    </div>
  )
}

