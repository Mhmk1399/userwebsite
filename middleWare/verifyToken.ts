import { NextResponse } from "next/server";
import Jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
  phone: string;
  role: string;
}

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    if (!token) {
      return null;
    }

    // Remove 'Bearer ' if present
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify and decode the token
    const decoded = Jwt.verify(
      cleanToken,
      process.env.JWT_SECRET!
    ) as DecodedToken;

    // Validate decoded token structure
    if (!decoded || typeof decoded !== "object") {
      return null;
    }

    return decoded;
  } catch (error) {
    if (error instanceof Jwt.TokenExpiredError) {
      console.error("Token expired");
    } else if (error instanceof Jwt.JsonWebTokenError) {
      console.error("Invalid token");
    } else {
      console.error("Token verification failed:", error);
    }
    return null;
  }
};

export const validateRequest = async (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new NextResponse(
      JSON.stringify({ message: "Authorization header missing" }),
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid or expired token" }),
      { status: 401 }
    );
  }

  return decoded;
};
