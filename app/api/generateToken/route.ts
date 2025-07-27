import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import storeConfig from "../../../store-config.json";

export async function GET() {
  try {
    const storeId = process.env.storeId;
    console.log(storeId, "ssssssssssssss");
    const VPS_URL = process.env.VPS_URL;

    // Generate a unique token for sections
    const secret = process.env.JWT_SECRET;
    console.log(secret, "secret");

    const sectionsToken = jwt.sign(
      {
        storeId,
        VPS_URL,

        timestamp: Date.now(),
      } as JwtPayload,
      secret!,
      {
        expiresIn: "1h", // Short-lived token
        // algorithm: "HS256" // Specify the algorithm
      }
    );
    console.log(sectionsToken, "sectionsToken");

    // Add CORS headers to the response
    return NextResponse.json(
      sectionsToken

      //   {
      //     headers: {
      //       "Access-Control-Allow-Origin": "*", // Allow all origins
      //       "Access-Control-Allow-Methods": "GET, OPTIONS", // Allow only GET and OPTIONS
      //       "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
      //     },
      //   }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
        },
      }
    );
  }
}
