import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/data';
import StoreUsers from '@/models/storesUsers';
import { getStoreId } from '@/utils/getStoreId';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    await connect();

     const storeId = getStoreId(request);
    const existingUser = await StoreUsers.findOne({ phone: phoneNumber, storeId });

    return NextResponse.json({ 
      exists: !!existingUser,
      message: existingUser ? 'User exists' : 'User not found'
    });
  } catch (error) {
    console.log('Check phone error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}