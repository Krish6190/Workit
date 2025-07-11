"use client";
import { LogOut } from "./Authenticate";
import { useDelayedNavigation } from "./hooks/useDelayedNavigation";

export default function NavigationBar(){
    const { navigateWithDelay } = useDelayedNavigation();
    
    return(
        <div className="navBar">
            <p>WorkIt</p>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateWithDelay("/home"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateWithDelay("/profile"); }}>Profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateWithDelay("/calculator"); }}>Calculator</a>
            <LogOut/>
        </div>
    );
}
