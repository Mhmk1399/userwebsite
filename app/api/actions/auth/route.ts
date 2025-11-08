import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import StoreUsers from "@/models/storesUsers";
import Verification from "@/models/verification";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/middleWare/verifyToken";

/**
 * Unified Auth Action Handler
 * All authentication actions go through this single endpoint
 */

type AuthAction =
  | "register"
  | "login"
  | "verify-token"
  | "check-phone"
  | "update-profile"
  | "delete-account"
  | "logout"
  | "get-profile";

interface AuthRequest {
  action: AuthAction;
  data?: unknown;
}

interface RegisterData {
  name: string;
  phone: string;
  email?: string;
  password: string;
  smsCode: string;
}

interface LoginData {
  phone: string;
  password: string;
  smsCode: string;
}

interface VerifyTokenData {
  token: string;
}

interface CheckPhoneData {
  phoneNumber: string;
}

interface UpdateProfileData {
  userId: string;
  name?: string;
  phone?: string;
}

interface GetProfileData {
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { action, data }: AuthRequest = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action is required" },
        { status: 400 }
      );
    }

    await connect();

    switch (action) {
      case "register":
        return await handleRegister(data);

      case "login":
        return await handleLogin(data, request);

      case "verify-token":
        return await handleVerifyToken(data);

      case "check-phone":
        return await handleCheckPhone(data);

      case "update-profile":
        return await handleUpdateProfile(data, request);

      case "delete-account":
        return await handleDeleteAccount(request);

      case "logout":
        return await handleLogout();

      case "get-profile":
        return await handleGetProfile(data, request);

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Auth action error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * Register new user
 */
async function handleRegister(data: unknown) {
  try {
    const { name, phone, email, password, smsCode } = data as RegisterData;

    // Validate required fields
    if (!name || !phone || !password || !smsCode) {
      return NextResponse.json(
        { success: false, message: "جمیع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // Verify SMS code
    const verification = await Verification.findOne({
      phone,
      code: smsCode,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: "کد تایید نامعتبر است" },
        { status: 400 }
      );
    }

    const storeId = process.env.STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "تنظیمات سیستم نامعتبر است" },
        { status: 500 }
      );
    }

    // Check if user already exists
    const existingUser = await StoreUsers.findOne({ phone, storeId });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربری با این شماره تلفن قبلاً ثبت نام کرده است",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await StoreUsers.create({
      name,
      storeId,
      phone,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, message: "تنظیمات سیستم نامعتبر است" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        storeId: newUser.storeId,
        name: newUser.name,
        phone: newUser.phone,
        role: "user",
      },
      jwtSecret,
      { expiresIn: "10h" }
    );

    // Delete verification record
    await Verification.deleteOne({ _id: verification._id });

    const response = NextResponse.json({
      success: true,
      message: "ثبت نام با موفقیت انجام شد",
      token,
      userId: newUser._id.toString(),
      user: {
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      },
    });

    // Set cookie
    response.cookies.set("tokenUser", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

/**
 * Login user
 */
async function handleLogin(data: unknown, request: NextRequest) {
  console.log(request);
  try {
    const { phone, password, smsCode } = data as LoginData;

    if (!phone || !password || !smsCode) {
      return NextResponse.json(
        {
          success: false,
          message: "شماره تلفن، رمز عبور و کد تایید الزامی است",
        },
        { status: 400 }
      );
    }

    // Verify SMS code
    const verification = await Verification.findOne({
      phone,
      code: smsCode,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: "کد تایید نامعتبر است" },
        { status: 400 }
      );
    }

    const storeId = process.env.STORE_ID;

    // Find user
    const user = await StoreUsers.findOne({ phone, storeId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "رمز عبور نامعتبر است" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, message: "تنظیمات سیستم نامعتبر است" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        storeId: user.storeId,
        name: user.name,
        phone: user.phone,
        role: user.role || "user",
      },
      jwtSecret,
      { expiresIn: "10h" }
    );

    // Delete verification record
    await Verification.deleteOne({ _id: verification._id });

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد",
      token,
      userId: user._id.toString(),
      user: {
        name: user.name,
        phone: user.phone,
      },
    });

    // Set cookie
    response.cookies.set("tokenUser", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Verify JWT token
 */
async function handleVerifyToken(data: unknown) {
  try {
    const { token } = data as VerifyTokenData;

    if (!token) {
      return NextResponse.json(
        { success: false, valid: false, message: "توکن الزامی است" },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: "توکن نامعتبر یا منقضی شده است",
        },
        { status: 401 }
      );
    }

    // Optional: Verify user still exists
    const user = await StoreUsers.findById(decoded.userId).select(
      "_id name phone email"
    );
    if (!user) {
      return NextResponse.json(
        { success: false, valid: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    throw error;
  }
}

/**
 * Check if phone exists
 */
async function handleCheckPhone(data: unknown) {
  try {
    const { phoneNumber } = data as CheckPhoneData;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    const storeId = process.env.STORE_ID;
    const existingUser = await StoreUsers.findOne({
      phone: phoneNumber,
      storeId,
    });

    return NextResponse.json({
      success: true,
      exists: !!existingUser,
      message: existingUser ? "کاربر وجود دارد" : "کاربر یافت نشد",
    });
  } catch (error) {
    console.error("Check phone error:", error);
    throw error;
  }
}

/**
 * Update user profile
 */
async function handleUpdateProfile(data: unknown, request: NextRequest) {
  try {
    // Validate token
    const authResult = await validateRequestAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, name, phone } = data as UpdateProfileData;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر الزامی است" },
        { status: 400 }
      );
    }

    // Ensure user can only update their own data
    if (authResult.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const updatedUser = await StoreUsers.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "پروفایل با موفقیت به‌روزرسانی شد",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}

/**
 * Delete user account
 */
async function handleDeleteAccount(request: NextRequest) {
  try {
    // Validate token
    const authResult = await validateRequestAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = await StoreUsers.findByIdAndDelete(authResult.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "حساب کاربری با موفقیت حذف شد",
    });

    // Clear cookie
    response.cookies.set("tokenUser", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    throw error;
  }
}

/**
 * Logout user
 */
async function handleLogout() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "خروج با موفقیت انجام شد",
    });

    // Clear cookie
    response.cookies.set("tokenUser", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Get user profile
 */
async function handleGetProfile(data: unknown, request: NextRequest) {
  try {
    // Validate token
    const authResult = await validateRequestAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = data as GetProfileData;

    // Ensure user can only access their own data
    if (userId && authResult.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const user = await StoreUsers.findById(authResult.userId).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}

/**
 * Helper: Validate request authentication
 */
async function validateRequestAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: "احراز هویت الزامی است" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: "توکن نامعتبر یا منقضی شده است" },
      { status: 401 }
    );
  }

  return decoded;
}
