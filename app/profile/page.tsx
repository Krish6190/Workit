import NavigationBar from "../navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import { FaPencil } from "react-icons/fa6";
import Link from "next/link";

export default async function Profile() {
    const cookieStore = await cookies();
    const username = cookieStore.get("session")?.value;
    return (
        <div>
            <NavigationBar />
            <Link href={"profile/edit"} className="editProfile">
                <FaPencil style={{ marginRight: "8px" }}/>Edit profile
            </Link>
            <div className="profile">
                <div className="profileText">
                <div className="profileSection">
                    <div className="sections">Name
                        <input readOnly value={username}></input>
                    </div>
                    <div className="sections">Age
                        <input readOnly ></input>
                    </div>
                </div>
                <div className="profileSection">
                    <div className="sections">Weight
                        <input readOnly></input>
                    </div>
                    <div className="sections">Height
                        <input readOnly></input>
                    </div>
                </div>
                <div className="profileSection">
                    <div className="sections">Sex
                        <input readOnly></input>
                    </div>
                </div>
            </div>
            <Image
                    src="/pictures/blank-profile.webp"
                    alt="/pictures/blank-profile.webp"
                    width={150} height={100} className="ProfileImage"
                    ></Image>
                    </div>
        </div>
    )
}