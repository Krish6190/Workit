import { cookies } from "next/headers"
import NavigationBar from "../navigation"

export default async function FirstPage(){
    let cookieStore= await cookies();
    const username=cookieStore.get("session")?.value;
    return(
        <div>
            <NavigationBar/>
        </div>
    )
}