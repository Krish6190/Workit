import { cookies } from "next/headers"
import NavigationBar from "../navigation"

export default async function FirstPage(){
const cookieStore = await cookies();
const username=cookieStore.get("session")?.value;
    return(
        <div>
            <NavigationBar/>
            <h2>Hello {username}</h2>
        </div>
    )
}