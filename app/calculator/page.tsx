import Calculator from "./calculator";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

interface SearchParams {
  age?: string;
  sex?: string;
  weight?: string;
  height?: string;
  activityLevel?: string;
  extraCalories?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function CalculatorPage({ searchParams }: PageProps) {
  const search=await searchParams;
  const prisma = new PrismaClient();
  let userParams = {
    age: "",
    sex: "",
    weight: "",
    height: "",
    activityLevel: "",
    extraCalories: search.extraCalories || ""
  };
  
  try {
    const cookieStore = await cookies();
    const username = cookieStore.get("session")?.value;
    
    if (username) {
      const user = await prisma.user.findUnique({ where: { username } });
      
      if (user) {
        userParams.age = user.age && user.age !== "NA" ? user.age : "";
        userParams.sex = user.sex && user.sex !== "NA" ? user.sex : "";
        userParams.weight = user.weight && user.weight !== "NA" ? user.weight : "";
        userParams.height = user.height && user.height !== "NA" ? user.height : "";
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    await prisma.$disconnect();
  }
  
  const finalParams = {
    ...userParams,
    ...Object.fromEntries(
      Object.entries(search).map(([key, value]) => [key, value || ""])
    )
  };
  
  return <Calculator initialParams={finalParams} />;
}
