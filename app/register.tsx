"use client";

import { useState } from "react";

type RegisterProp={
    onRegisterSuccess: ()=>void;
}
export default function Register({onRegisterSuccess }:RegisterProp) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
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
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter the Password"
        />
      </div>
      <div className="loginCred">
        Confirm Password:
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Re-Enter the Password"
        />
      </div>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      {success && <p className="success" style={{ color: "green" }}>{success}</p>}
      <button type="submit">Register</button>
    </form>
  );
}
