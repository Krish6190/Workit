import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const username = cookieStore.get("session")?.value;
        
        if (!username) {
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }

        const { fullName, age, height, weight, sex } = await req.json();


        const updatedUser = await prisma.user.update({
            where: { username },
            data: {
                fullName: fullName || null,
                age: age || "NA",
                height: height || "NA",
                weight: weight || "NA",
                sex: sex || "NA"
            }
        });

        return new Response(
            JSON.stringify({ message: "Profile updated successfully", user: updatedUser }),
            { status: 200 }
        );
} catch {
        return new Response(
            JSON.stringify({ error: "Failed to update profile" }),
            { status: 500 }
        );
    }
}
