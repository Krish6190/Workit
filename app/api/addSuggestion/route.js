import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { newItem } = await req.json();
    const filePath = path.join(process.cwd(), 'food_calories.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (!data.suggestedItems.includes(newItem)) {
      data.suggestedItems.push(newItem);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ 
        success: true, 
        message: 'Item added successfully!' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Item already exists in suggestions' 
      });
    }
  } catch (error) {
    console.error('Error updating suggestions:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error updating file',
      error: error.message 
    }, { status: 500 });
  }
}
