import React from "react";
import {useNavigate} from "react-router-dom";
// import Logout from "./Logout";
// import { useAuth } from "../hooks/useAuth";

// https://tailwindcomponents.com/component/navbar-with-tagline-and-logo

const Header = () => {

    const navigate = useNavigate();
    //const auth = useAuth();

    return (
        <>
        <nav className="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 shadow sm:items-baseline w-full bg-[#212121]">

            <div className="mb-2 sm:mb-0 flex flex-row">
              <div className="h-15 w-40 self-center mr-2">
                <a href="/home">
                  {/* <img className="h-15 w-40 self-center" src={ logo } /> */}
                  <p className="m-2 h-15 w-40 self-center text-white font-extrabold text-3xl">Mr. Robot</p>
                </a>
              </div>


              {/* <div>
                <a href="/home" className="text-2xl no-underline text-white hover:text-blue-dark font-sans font-bold">EPC</a>
                <br />
                <span className="text-xs text-white">Digital Innovations.</span>
              </div> */}
            </div>

            <div className="self-center text-white flex flex-row">
              {/* <span className="m-2 h-15 w-15  text-white">{auth.username}</span> */}

              {/* <Logout/> */}
            </div>


        </nav>
        </>);
    };

export default Header;