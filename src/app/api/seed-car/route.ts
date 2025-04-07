import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'This route is only available in development mode' }, { status: 403 });
    }
    
    // Create a test car
    const car = await db.car.create({
      data: {
        name: "BMW X5",
        images: ["https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=1976&auto=format&fit=crop"],
        status: "Ready",
        under: "John Doe",
        sim: "SIM-123456",
        petrol: 45,
        oil: "Good condition",
        km: 12500,
        licence: "ABC-123",
        penalty: "None",
        history: "Regular maintenance performed on schedule."
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Created test car successfully', 
      car 
    });
  } catch (error: any) {
    console.error('Error seeding car:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to seed car'
    }, { 
      status: 500 
    });
  }
} 