import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse} from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers:{'Content-Type': 'application/json'}});
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers:{'Content-Type': 'application/json'}});
  }
  const Response= new NextResponse(JSON.stringify({ message: 'Login successful' }), { status: 200, headers:{'Content-Type': 'application/json'}});
  Response.cookies.set('session',username);
  return Response;
}
