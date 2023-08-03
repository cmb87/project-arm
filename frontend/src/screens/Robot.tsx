import React, { useRef, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';

import Badge from '../components/Badge';
import {InputFieldSelectSlim} from '../components/InputFieldSlim';
import Heading from '../components/Heading';
import Button from '../components/Button';
import PlotRobot from '../components/PlotRobot';
import PlotTimeseries from '../components/PlotTimeseries';

import { SerialRobot } from '../robots/serialRobot';
import { DeltaRobot } from '../robots/deltaRobot';

import Slider from '../components/Slider';
import background from '../assets/test.png';


export default function Robot() {

  //e:number, f:number, re:number, rf:number, xoff: number = 0, yoff: number = 0, zoff: number = 0
  //const robot = // e,f,re,rf

  const navigate = useNavigate();
  const [robotType, setRobotType] = useState<string>( )
  const [robot, setRobot] = useState<SerialRobot | DeltaRobot>( )
  const [xcursor, setXcursor] = useState<number[]>([])
  const [update, setUpdate] = useState<boolean | number>(true)
  const [waypoint, setWaypoint] = useState(true)
  const [simlating, setSimulating] = useState(false)
  const [info, setInfo] = useState({})

  const [tilt, setTilt] = useState(0);



  // --------------------- Build robot -------------------
  useEffect(() => {

    if (robotType === "serial") {
      const r = new SerialRobot([0.5,0.6,0.3], [0.5, 0.5, 0.2], 2.8)
      const x0 = r.forwardKinematic([0,0,0,0]);
  
      if (x0.status !== -1) {
        r.trajectory.init([0.0,0.0,0.0,0.0], [...x0.x,0.0] );
        setXcursor(x0.x);
      }
  
      setRobot(r);
      console.log("New serial robot initialized")
      
  
    } else if (robotType === "delta") {

      const r = new DeltaRobot(0.115, 0.357, 0.332, 0.132, [0.5, 0.5, 0.8], 0.8)
      const x0 = r.forwardKinematic([0.0,0.0,0.0,0.0]);
  
      if (x0 !== -1) {
        r.trajectory.init([0.0,0.0,0.0,0.0], [...x0.x] );
        setXcursor(x0.x);
      }
  
      console.log("New delta robot initialized")
      setRobot(r);
    }

    
  }, [robotType])

  // --------------------- Update robot geometry based on cursor move -------------------
  useEffect( () => {

    if (!robot) return
    const thetaCursor = robot!.inverseKinematic([xcursor[0], xcursor[1], xcursor[2], tilt]);
    if (thetaCursor.status !== 0 ) return 

    setUpdate(!update);


  }, [xcursor, tilt])

  // --------------------- Add waypoint -------------------
  useEffect(()=>{

    if (!robot) return
    const thetaCursor = robot!.inverseKinematic([xcursor[0], xcursor[1], xcursor[2], tilt]);

    if (thetaCursor.status !== 0 ) return 
    robot?.trajectory.addPoints(thetaCursor.jointAngles, [...xcursor, tilt], 1000);
    setUpdate(!update);

  }, [waypoint])

  // --------------------- Info -------------------
  useEffect(()=>{
    if (!robot) return
    setInfo({
      name: robotType,
      pos: robot.getCurrentEndEffectorPosition().map((x:number) => parseFloat(x.toFixed(2))),
      jointStates: robot.getCurrentJointStates(false).map((x:number) =>parseFloat(x.toFixed(2))),
    })
  }, [update])
  // --------------------- ------------------
  // Start a simulation
  const simulate = async (dt: number=100) => {
    if (simlating) return
    if (!robot) return

    setSimulating(true);
    await robot.run(150, setUpdate)   
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


      <div className="grid grid-cols-2 gap-4">

      
      <div className="grid grid-cols-2 gap-4">
      {/* ===================================================================== */}


        <div className="border border-gray-300 rounded-xl">
          {robot && <PlotRobot robot={robot} xaxis={0} yaxis={2} xcursor={xcursor} setXcursor={setXcursor} update={update} waypointSetTrigger={()=> setWaypoint(!waypoint)} />}
        </div>
        <div className="border border-gray-300 rounded-xl">
          {robot &&<PlotRobot robot={robot} xaxis={1} yaxis={2} xcursor={xcursor} setXcursor={setXcursor} update={update} waypointSetTrigger={()=> setWaypoint(!waypoint)} />}
        </div>
        <div className="border border-gray-300 rounded-xl">
          {robot &&<PlotRobot robot={robot} xaxis={0} yaxis={1} xcursor={xcursor} setXcursor={setXcursor} update={update} waypointSetTrigger={()=> setWaypoint(!waypoint)} imageUrl={background}/>}
        </div>
        <div className="border border-gray-300 rounded-xl p-5 bg-gray-300">
          <div className="mt-5">
            <Button onClick={()=> simulate()} disabled={simlating} title='Start Simulation'></Button>
            <Button onClick={()=> reset()} disabled={simlating} title='Reset'></Button>
          </div>
          <div className="mt-5">
            <Slider name={"angle"} value={`${tilt}`} setValue={(x:string) => setTilt(parseFloat(x)/100)} min={"-90"} max={"90"}  />
          </div>

          <div className="mt-5">
            <InputFieldSelectSlim 
              id={"0"}
              label='Robot Type'
              options={[{key: "Delta", value: "delta"}, {key: "Serial", value: "serial"}]}
              onChange={(v:string) => setRobotType(v)}
            />
          </div>
          

         
        </div>


      </div>

        <div className="border border-gray-300 rounded-xl p-5 col-span-1">
          <PlotTimeseries robot={robot} update={update}/>

          <pre>
            {JSON.stringify(info, null, 2)}
          </pre>
        </div>


      </div>

    </div>
  )
}

