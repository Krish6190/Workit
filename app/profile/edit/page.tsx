import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import EditPageClient from "./EditPageClient";

export default async function Edit() {
    const cookieStore = await cookies();
    const username = cookieStore.get("session")?.value;

    if (!username) {
        return <div>Please log in to access this page.</div>;
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { username } });
    const age = user?.age === "NA" ? "" : user?.age || "";
    const height = user?.height === "NA" ? "" : user?.height || "";
    const weight = user?.weight === "NA" ? "" : user?.weight || "";
    const sex = user?.sex === "NA" ? "" : user?.sex || "";
    const fullName = (user as Record<string, unknown>)?.fullName as string || username;
    const profileImg = user?.profileImg === "" ? "/pictures/blank-profile.webp" : user?.profileImg || "/pictures/blank-profile.webp";

    return (
        <EditPageClient
            username={username}
            initialData={{
                fullName,
                age: age || '',
                height: height || '',
                weight: weight || '',
                sex: sex || '',
                profileImg: profileImg || '',
            }}
        />
    );
}
