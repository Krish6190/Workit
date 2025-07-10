import NavigationBar from "../navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import { FaPencil } from "react-icons/fa6";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

export default async function Profile() {
    const cookieStore = await cookies();
    const username = cookieStore.get("session")?.value;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { username } });
    const age = user?.age, height = user?.height, weight = user?.weight, sex = user?.sex;

    return (
            <div className="profile-bg">
                <NavigationBar />
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-img-container">
                            <Image
                                src="/pictures/blank-profile.webp"
                                alt="Profile"
                                width={140}
                                height={120}
                                className="profile-img"
                            />
                            <Link href="/profile/edit" className="editProfileBtn">
                                <FaPencil style={{ marginRight: "8px" }} />
                                Edit Profile
                            </Link>
                        </div>
                        <h2 className="profile-username">{username}</h2>
                    </div>
                    <div className="profile-card-body">
                        <div className="profile-info">
                            <div>
                                <span className="profile-label">Age</span>
                                <span className="profile-value">{age || 'NA'}</span>
                            </div>
                            <div>
                                <span className="profile-label">Sex</span>
                                <span className="profile-value">{sex || 'NA'}</span>
                            </div>
                        </div>
                        <div className="profile-info">
                            <div>
                                <span className="profile-label">Height</span>
                                <span className="profile-value">{height || 'NA'}</span>
                            </div>
                            <div>
                                <span className="profile-label">Weight</span>
                                <span className="profile-value">{weight || 'NA'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
