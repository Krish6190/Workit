"use client"
/*
TO DO : 
Add an About page
Add css to calculator and add an item picker in the calculator
Add profile picture update api
*/

import {Authentication} from "./Authenticate";
import Register from "./register";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
const [prop, setProp] = useState(true);

  function login() {
    if (prop != true) setProp(true);
  }

  function signup() {
    if (prop != false) setProp(false);
  }

  function showLogin() {
    setProp(true);
  }
  return (
        <div className="welcomeContainer">
          <div className="welcome">
            Welcome
            <br></br>
            So who are we serving Today
          </div>
          {prop==true && <Authentication></Authentication>}
          {prop==false && <Register onRegisterSuccess={showLogin}></Register>}
          <div className="logReg">
            <Link href="" onClick={() => { login() }}>Login |</Link><Link href="" onClick={() => { signup() }}>  SignUP</Link>
          </div>
        </div>
  );
}
