import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/data';
import StoreUsers from '@/models/storesUsers';
import Verification from '@/models/verification';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code, newPassword } = await request.json();

    if (!phoneNumber || !code || !newPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connect();

    // Verify SMS code
    const verification = await Verification.findOne({ 
      phone: phoneNumber, 
      code,
      verified: true,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return NextResponse.json({ message: 'کد نامعتبر است' }, { status: 400 });
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await StoreUsers.findOneAndUpdate(
      { phone: phoneNumber },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Delete verification record
    await Verification.deleteOne({ _id: verification._id });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log('Reset password error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}