import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './middleWare/verifyToken';

export function middleware(request: NextRequest) {
  // Temporarily disable middleware to test if it's causing the issue
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};