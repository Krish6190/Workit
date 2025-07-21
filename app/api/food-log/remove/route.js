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

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to modify your food logs' }, 
        { status: 401 }
      );
    }

    const { id } = params;
    const itemId = parseInt(id);

    if (!itemId) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const item = await prisma.foodLogItem.findUnique({
      where: { id: itemId },
      include: {
        foodLog: {
          select: { userId: true, id: true }
        }
      }
    });

    if (!item || item.foodLog.userId !== user.id) {
      return NextResponse.json(
        { error: 'Item not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.foodLogItem.delete({
      where: { id: itemId }
    });
    const remainingItems = await prisma.foodLogItem.findMany({
      where: { foodLogId: item.foodLog.id }
    });
    const newTotalCalories = remainingItems.reduce((sum, remainingItem) => {
      return sum + (remainingItem.calories * remainingItem.quantity);
    }, 0);
    await prisma.foodLog.update({
      where: { id: item.foodLog.id },
      data: { 
        totalCalories: newTotalCalories,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Food item removed successfully'
    });

  } catch (error) {
    console.error('Error deleting food log item:', error);
    return NextResponse.json(
      { error: 'Failed to delete food item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
