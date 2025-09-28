import { NextResponse } from 'next/server';
import { verifyToken } from '@/middleWare/verifyToken';
import connect from '@/lib/data';
import StoreUsers from '@/models/storesUsers';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Optional: Verify user still exists in database
    await connect();
    const user = await StoreUsers.findById(decoded.userId).select('_id name phone');
    
    if (!user) {
      return NextResponse.json(
        { valid: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Token verification failed' },
      { status: 500 }
    );
  }
}