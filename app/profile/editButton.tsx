"use client"
import { useDelayedNavigation } from "../hooks/useDelayedNavigation";
import { FaPencil } from "react-icons/fa6";

export function EditButton() {
    const { navigateWithDelay } = useDelayedNavigation();
    return(
    <a href="#" className="editProfileBtn"
        onClick={(e) => { e.preventDefault(); navigateWithDelay("/profile/edit"); }}>
        <FaPencil style={{ marginRight: "8px" }} />
        Edit Profile
    </a> 
    )
}