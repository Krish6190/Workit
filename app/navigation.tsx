import Link from "next/link"
import { LogOut } from "./Authenticate";

export default function NavigationBar(){
    return(
        <div className="navBar">
            <Link href={"/home"}>About</Link>
            <Link href={"/calculator"}>Calculator</Link>
            <LogOut/>
        </div>
    );
}