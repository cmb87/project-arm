import React, {useContext, useState, useEffect} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import { BsBugFill } from 'react-icons/bs';
import './App.css';

import Footer from './components/Footer';
import Delta from './screens/Delta';
import Serial from './screens/Serial';
import './App.css';





function App() {


  return (
    <div className="h-screen w-full flex flex-col">

      <Routes>
        <Route path="/" element={<Navigate replace to="/start"/>}/>
        <Route path="start" element={<Delta/>}/>
        

        <Route path="*" element={
          <>

            {/* <PrivateRoute> */}

                  <Header/>
                  <br />
     
                  <main className={'w-full pl-0.5 pr-0.5 lg:pl-5 lg:pr-5 items-center flex flex-col flex-grow '}>
                  {/* <RequestInterceptor> */}
                    <Routes>
                      
                      <Route path="delta" element={<Delta/>}/>
                      <Route path="serial" element={<Serial/>}/>

                    </Routes>
                  {/* </RequestInterceptor> */}
                  </main>

            {/* </PrivateRoute> */}

 

          </>  
        } />
      </Routes>

      <Footer/>
  

    </div>
  );
}

export default App;
