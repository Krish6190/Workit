"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Authentication() {
    let [username, SetUsername] = useState("");
    let [password, SetPassword] = useState("");
    let [error,SetError] = useState("");
    let[showPassword,SetShowPassword] = useState(false);
    let router=useRouter();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res=await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            router.push("/calculator");
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