"use client";
import { LogOut } from "./Authenticate";
import { useDelayedNavigation } from "./hooks/useDelayedNavigation";
import { useRouter } from "next/navigation";

export default function NavigationBar(){
    const { navigateWithDelay } = useDelayedNavigation();
    const router = useRouter();
    
    const handleNavigation = (path: string, e: React.MouseEvent) => {
        e.preventDefault();
        navigateWithDelay(path);
    };
    
    return(
        <div className="navBar">
            <p>WorkIt</p>
            <a href="#" onClick={(e) => handleNavigation("/home", e)}>About</a>
            <a href="#" onClick={(e) => handleNavigation("/profile", e)}>Profile</a>
            <a href="#" onClick={(e) => handleNavigation("/calculator", e)} style={{paddingRight:"40px"}}>Calculator</a>
            <a href="#" onClick={(e) => handleNavigation("/food-diary", e)}>Food Diary</a>
            <LogOut/>
        </div>
    );
}
