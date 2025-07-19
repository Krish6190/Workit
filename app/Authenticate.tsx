"use client"
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDelayedNavigation } from "./hooks/useDelayedNavigation";
import { usePageTransition } from "./Components/PageTransition";

export function Authentication() {
    const [username, SetUsername] = useState("");
    const [password, SetPassword] = useState("");
    const [error, SetError] = useState("");
    const [showPassword, SetShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { navigateWithDelay } = useDelayedNavigation();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        SetError("");
        
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            
            if (res.ok) {
                navigateWithDelay("/profile", "bottom");
            } else {
                let errorMessage = "Incorrect Credentials";
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    errorMessage = data.error || errorMessage;
                }
                SetError(errorMessage);
                SetPassword("");
                setIsSubmitting(false);
            }
        } catch (err) {
            SetError("Network error. Please try again.");
            setIsSubmitting(false);
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
                    disabled={isSubmitting}
                />
            </div>
            <div className="loginCred">Password:
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => SetPassword(e.target.value)}
                    placeholder="Enter the Password"
                    disabled={isSubmitting}
                />
                <button onClick={() => SetShowPassword(v => !v)} type="button" className="eye" disabled={isSubmitting}>
                    {showPassword == true ? <FaEye /> : <FaEyeSlash />}
                </button>
                {error && <p className="error">{error}</p>}
            </div>
            <button type="submit" id="loginButton" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}

export function LogOut() {
    const { navigateWithDelay } = useDelayedNavigation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        if (isLoggingOut) return;
        
        setIsLoggingOut(true);
        try {
            await fetch("/api/logout", { method: "POST" });
            navigateWithDelay("/", "bottom");
        } catch (err) {
            setIsLoggingOut(false);
            console.error("Logout failed:", err);
        }
    }
    
    return (
        <div 
            className={`LogOut ${isLoggingOut ? 'disabled' : ''}`} 
            onClick={handleLogout}
        >
            {isLoggingOut ? "Logging out..." : "Logout"}
        </div>
    );
}
