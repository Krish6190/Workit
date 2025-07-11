"use client";

import NavigationBar from "@/app/navigation";
import ProfileEditForm from "./ProfileEditForm";

type EditPageClientProps = {
    username: string;
    initialData: {
        fullName: string;
        age: string;
        height: string;
        weight: string;
        sex: string;
    };
};

export default function EditPageClient({ username, initialData }: EditPageClientProps) {
    return (
        <div className="modern-profile-bg">
            <NavigationBar />
            <div className="modern-profile-container">
                <div className="modern-profile-card">
                    <div className="modern-profile-header">
                        <div className="modern-profile-avatar">
                            <img
                                src="/pictures/blank-profile.webp"
                                alt="Profile"
                                width={140}
                                height={120}
                                className="modern-avatar-img"
                            />
                        </div>
                        <h1 className="modern-profile-name">{username}</h1>
                    </div>

                    <ProfileEditForm initialData={initialData} />
                </div>
            </div>
        </div>
    );
}
