"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDelayedNavigation } from "./hooks/useDelayedNavigation";

export function Authentication() {
    let [username, SetUsername] = useState("");
    let [password, SetPassword] = useState("");
    let [error,SetError] = useState("");
    let[showPassword,SetShowPassword] = useState(false);
    const { navigateWithDelay } = useDelayedNavigation();
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res=await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            navigateWithDelay("/profile");
        } else {
            const data = await res.json();
            SetError(data.error ||"Incorrect Credentials");
        }
    }
    return (
        <form onSubmit={handleSubmit} className="auth-bar">
            <div className="loginCred">Username:
            <input
                type="text"
                value={username}
                onChange={e => SetUsername(e.target.value)}
                placeholder="Enter the Username"
            />
            </div>
            <div className="loginCred">Password:
            <input
                type={showPassword ? "text":"password"}
                value={password}
                onChange={e => SetPassword(e.target.value)}
                placeholder="Enter the Password"
            />
            <button onClick={()=>SetShowPassword(v=>!v)} type="button" className="eye">
                {showPassword==true ? <FaEye/> : <FaEyeSlash/>}
            </button>
            {error && <p className="error">{error}</p>}
            </div>
            <button type="submit" id="loginButton">Login</button>
        </form>
    );
}

export function LogOut(){
    const { navigateWithDelay } = useDelayedNavigation();
    
    async function handleLogout(){
        await fetch("./api/logout",{method:"POSt"});
        navigateWithDelay("/");
    }
    return(
        <div className="LogOut" onClick={()=>handleLogout()}>Logout</div>
    )
}
