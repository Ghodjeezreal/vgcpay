import { NextResponse } from 'next/server';

// This route is deprecated - database is now managed by Prisma migrations
// Run: npx prisma migrate dev

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Database initialization is handled by Prisma migrations',
      instructions: 'Run: npx prisma migrate dev'
    },
    { status: 200 }
  );
}
