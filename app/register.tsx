"use client";

import { useState } from "react";
import { FaEye,FaEyeSlash } from "react-icons/fa";

type RegisterProp={
    onRegisterSuccess: ()=>void;
}
export default function Register({onRegisterSuccess }:RegisterProp) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passError,setPassError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || !confirm || passError) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Plz enter the same password");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        onRegisterSuccess(); 
      }, 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed.");
    }
  }

  function containsUppercase(str:string) {
    return /[A-Z]/.test(str) && /\d/.test(str);
  }

  function passRes(){
    if((password.length<9 || !containsUppercase(password)) && password.length>0){
      setPassError("Password should be atleast 8 character and contain an uppercase letter and a number")
    }
    else setPassError("");
  }

  return (
    <form onSubmit={handleSubmit} className="auth-bar" id="registerFrom">
      <div className="loginCred">
        Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter the Username"
        />
      </div>
      <div className="loginCred">
        Password:
        <input
          type={!showPassword?"password":"text"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter the Password"
          onBlur={()=>passRes()}
          onFocus={()=>setPassError("")}
        />
        <button onClick={()=>setShowPassword(v=>!v)} type="button" className="eye eye2">
          {showPassword==true?<FaEye/>:<FaEyeSlash/>}
        </button>
      </div>
      {passError!="" && <div className="error passError">{passError}</div>}
      <div className="loginCred">
        Confirm Password:
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Re-Enter the Password"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <button type="submit" id="regButton">Register</button>
    </form>
  );
}
