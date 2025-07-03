"use client"
/*
TO DO : 
Create the api for register toggle
*/
import Authentication from "./Authenticate";
import Register from "./register";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  let [prop, setProp] = useState(1);
  
  function login() {
    if (prop != 1) setProp(1);
  }

  function signup() {
    if (prop != 0) setProp(0);
  }

  function showLogin() {
    setProp(1);
  }
  return (
    <div>
      <div className="welcome">
        Welcome
        <br></br>
        So who are we serving Today
      </div>
      {prop && <Authentication></Authentication>}
      {!prop && <Register onRegisterSuccess={showLogin}></Register>}
      <div className="logReg">
        <Link href="" onClick={() => { login() }}>Login |</Link><Link href="" onClick={() => { signup() }}>  SignUP</Link>
        </div>
    </div>
  );
}
