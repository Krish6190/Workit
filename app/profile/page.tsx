import NavigationBar from "../navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import { FaPencil } from "react-icons/fa6";
import { PrismaClient } from "@prisma/client";
import {EditButton} from "./editButton";
import { profile } from "console";

export default async function Profile() {
    const cookieStore = await cookies();
    const username = cookieStore.get("session")?.value;
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { username } });
    const age = user?.age, height = user?.height, weight = user?.weight, sex = user?.sex;
    const fullName = (user as any)?.fullName || username;
    const profileImg=user?.profileImg;

    return (
            <div className="profile-bg">
                <NavigationBar />
                <div className="profile-card">
                    <div className="profile-card-header">
                        <div className="profile-img-container">
                            <Image
                                src={profileImg===''?"/pictures/blank-profile.webp":profileImg||"/pictures/blank-profile.webp"}
                                alt="Profile"
                                width={140}
                                height={120}
                                className="profile-img"
                            />
                            <EditButton/>
                        </div>
                        <h2 className="profile-username">{fullName}</h2>
                        <p className="profile-handle">@{username}</p>
                    </div>
                    <div className="profile-card-body">
                        <div className="profile-info">
                            <div>
                                <span className="profile-label">Age</span>
                                <span className="profile-value">{age === 'NA' ? 'Not provided' : age || 'Not provided'}</span>
                            </div>
                            <div>
                                <span className="profile-label">Sex</span>
                                <span className="profile-value">{sex === 'NA' ? 'Not provided' : sex || 'Not provided'}</span>
                            </div>
                        </div>
                        <div className="profile-info">
                            <div>
                                <span className="profile-label">Height</span>
                                <span className="profile-value">{height === 'NA' ? 'Not provided' : height ? `${height} cm` : 'Not provided'}</span>
                            </div>
                            <div>
                                <span className="profile-label">Weight</span>
                                <span className="profile-value">{weight === 'NA' ? 'Not provided' : weight ? `${weight} kg` : 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
