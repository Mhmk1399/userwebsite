import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/data';
import Verification from '@/models/verification';
import StoreUsers from '@/models/storesUsers';
import bcrypt from 'bcryptjs';
import { sendVerificationCode, generateVerificationCode } from '@/lib/sms';

/**
 * Unified SMS Action Handler
 * All SMS-related actions go through this single endpoint
 */

type SmsAction = 
  | 'send-code'
  | 'verify-code'
  | 'resend-code'
  | 'reset-password';

interface SmsRequest {
  action: SmsAction;
  data?: string|undefined;
}

export async function POST(request: NextRequest) {
  try {
    const { action, data }: SmsRequest = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action is required' },
        { status: 400 }
      );
    }

    await connect();

    switch (action) {
      case 'send-code':
        return await handleSendCode(data);

      case 'verify-code':
        return await handleVerifyCode(data);

      case 'resend-code':
        return await handleResendCode(data);

      case 'reset-password':
        return await handleResetPassword(data);

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('SMS action error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Send SMS verification code
 */
async function handleSendCode(data: {phoneNumber:string,purpose:string}) {
  try {
    const { phoneNumber, purpose } = data;

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'شماره تلفن الزامی است' },
        { status: 400 }
      );
    }

    if (!/^09\d{9}$/.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'فرمت شماره تلفن نامعتبر است' },
        { status: 400 }
      );
    }

    // Check for existing non-expired verification (rate limiting)
    const existingVerification = await Verification.findOne({
      phone: phoneNumber,
      expiresAt: { $gt: new Date() }
    });

    if (existingVerification) {
      const timeLeft = Math.ceil((existingVerification.expiresAt.getTime() - Date.now()) / 1000);
      return NextResponse.json(
        { 
          success: false, 
          message: `لطفاً ${timeLeft} ثانیه دیگر تلاش کنید`,
          timeLeft 
        },
        { status: 429 }
      );
    }

    // For registration, check if user already exists
    if (purpose === 'register') {
      const storeId = process.env.STORE_ID;
      const existingUser = await StoreUsers.findOne({ phone: phoneNumber, storeId });
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'کاربری با این شماره تلفن قبلاً ثبت نام کرده است' },
          { status: 400 }
        );
      }
    }

    // For login/reset, check if user exists
    if (purpose === 'login' || purpose === 'reset-password') {
      const storeId = process.env.STORE_ID;
      const existingUser = await StoreUsers.findOne({ phone: phoneNumber, storeId });
      
      if (!existingUser) {
        return NextResponse.json(
          { success: false, message: 'کاربری با این شماره تلفن یافت نشد' },
          { status: 404 }
        );
      }
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save verification to database
    await Verification.findOneAndUpdate(
      { phone: phoneNumber },
      { 
        code, 
        expiresAt, 
        verified: false,
        purpose: purpose || 'general'
      },
      { upsert: true, new: true }
    );

    // Send SMS
    const sent = await sendVerificationCode(phoneNumber, code);

    if (!sent) {
      return NextResponse.json(
        { success: false, message: 'خطا در ارسال پیامک' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'کد تایید ارسال شد',
      expiresAt: expiresAt.toISOString(),
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Send code error:', error);
    throw error;
  }
}

/**
 * Verify SMS code
 */
async function handleVerifyCode(data: {phoneNumber:string,code:string}) {
  try {
    const { phoneNumber, code } = data;

    // Validate inputs
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { success: false, message: 'شماره تلفن و کد تایید الزامی است' },
        { status: 400 }
      );
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: 'کد باید ۶ رقمی باشد' },
        { status: 400 }
      );
    }

    // Find verification
    const verification = await Verification.findOne({
      phone: phoneNumber,
      code,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'کد نامعتبر یا منقضی شده است' },
        { status: 400 }
      );
    }

    // Mark as verified
    verification.verified = true;
    await verification.save();

    return NextResponse.json({
      success: true,
      message: 'کد با موفقیت تایید شد',
      verified: true
    });
  } catch (error) {
    console.error('Verify code error:', error);
    throw error;
  }
}

/**
 * Resend SMS code
 */
async function handleResendCode(data: {phoneNumber:string}) {
  try {
    const { phoneNumber } = data;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'شماره تلفن الزامی است' },
        { status: 400 }
      );
    }

    // Delete old verification
    await Verification.deleteMany({ phone: phoneNumber });

    // Generate new code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save new verification
    await Verification.create({
      phone: phoneNumber,
      code,
      expiresAt,
      verified: false
    });

    // Send SMS
    const sent = await sendVerificationCode(phoneNumber, code);

    if (!sent) {
      return NextResponse.json(
        { success: false, message: 'خطا در ارسال مجدد پیامک' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'کد تایید مجدداً ارسال شد',
      expiresAt: expiresAt.toISOString(),
      expiresIn: 300
    });
  } catch (error) {
    console.error('Resend code error:', error);
    throw error;
  }
}

/**
 * Reset password with SMS verification
 */
async function handleResetPassword(data: {phoneNumber:number,code:string,newPassword:string}) {
  try {
    const { phoneNumber, code, newPassword } = data;

    // Validate inputs
    if (!phoneNumber || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'تمامی فیلدها الزامی است' },
        { status: 400 }
      );
    }

    // Verify SMS code
    const verification = await Verification.findOne({
      phone: phoneNumber,
      code,
      verified: true,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: 'کد تایید نامعتبر است' },
        { status: 400 }
      );
    }

    // Find user
    const storeId = process.env.STORE_ID;
    const user = await StoreUsers.findOne({ phone: phoneNumber, storeId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete verification record
    await Verification.deleteOne({ _id: verification._id });

    return NextResponse.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر کرد'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}
