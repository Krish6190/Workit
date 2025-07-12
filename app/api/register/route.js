import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();

export async function POST(req){
    try{
        const {username,password} = await req.json();
        if(!username||!password){
            return new Response(
                JSON.stringify({error:"Username and password are Required"}),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        let existingUser=await prisma.user.findUnique({where : {username}});
        if(existingUser){
            return new Response(
                JSON.stringify({error:"Username already taken"}),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        const hashPass = await bcrypt.hash(password,10);
        await prisma.user.create({
            data:{
                username,
                password:hashPass,
                fullName:null,
                email:null,
                phone:null,
                age:'NA',
                height:'NA',
                weight:'NA',
                sex:'NA',
            }
        });
        return new Response(
            JSON.stringify({message:"Registration Successful"}),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
} catch {
        return new Response(
            JSON.stringify({error:"Registration Failed"}),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}