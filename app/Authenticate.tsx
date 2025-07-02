"use client"
import { useState } from "react";

export default function Authentication() {
    let [username, SetUsername] = useState("");
    let [password, SetPassword] = useState("");
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password })
        })
    }
    return (
        <form onSubmit={handleSubmit} className="auth-bar">
            <div>Username:<br></br>
            <input
                value={username}
                onChange={e => SetUsername(e.target.value)}
                placeholder="Username"
            />
            </div>
            <div>Password:<br></br>
            <input
                type="password"
                value={password}
                onChange={e => SetPassword(e.target.value)}
                placeholder="Password"
            />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}