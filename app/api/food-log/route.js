import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
async function getUserFromSession() {
  const cookieStore = await cookies();
  const username = cookieStore.get('session')?.value;
  if (!username) {
    return null;
  }
  const user = await prisma.user.findUnique({ 
    where: { username } 
  });
  return user;
}
export async function GET(req) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to access your food logs' }, 
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    let whereClause = { userId: user.id };

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      whereClause.date = {
        gte: queryDate,
        lt: nextDay
      };
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      whereClause.date = {
        gte: start,
        lte: end
      };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      whereClause.date = {
        gte: today,
        lt: tomorrow
      };
    }

    const foodLogs = await prisma.foodLog.findMany({
      where: whereClause,
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(foodLogs);
  } catch (error) {
    console.error('Error fetching food logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food logs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function POST(req) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to log your food' }, 
        { status: 401 }
      );
    }
    const { date, items } = await req.json();
    if (!date || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Date and items array are required' },
        { status: 400 }
      );
    }
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);
    const totalCalories = items.reduce((sum, item) => {
      return sum + (item.calories * (item.quantity || 1));
    }, 0);
    const foodLog = await prisma.foodLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: logDate
        }
      },
      update: {
        totalCalories: totalCalories,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        date: logDate,
        totalCalories: totalCalories
      },
      include: {
        items: true
      }
    });

    await prisma.foodLogItem.deleteMany({
      where: { foodLogId: foodLog.id }
    });

    const createdItems = await Promise.all(
      items.map(item => 
        prisma.foodLogItem.create({
          data: {
            foodLogId: foodLog.id,
            name: item.name,
            calories: item.calories,
            serving: item.serving,
            quantity: item.quantity || 1,
            imageUrl: item.imageUrl || null,
            time: item.time || null
          }
        })
      )
    );

    const updatedFoodLog = await prisma.foodLog.findUnique({
      where: { id: foodLog.id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Food log updated successfully',
      foodLog: updatedFoodLog
    });

  } catch (error) {
    console.error('Error creating/updating food log:', error);
    return NextResponse.json(
      { error: 'Failed to save food log' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
