"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Authentication() {
    let [username, SetUsername] = useState("");
    let [password, SetPassword] = useState("");
    let [error,SetError] = useState("");
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
            SetError("Incorrect Credentials");
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
                type="password"
                value={password}
                onChange={e => SetPassword(e.target.value)}
                placeholder="Enter the Password"
            />
            </div>
            <button type="submit" id="loginButton">Login</button>
        </form>
    );
}