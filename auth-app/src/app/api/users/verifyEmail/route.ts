import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

interface requestBody {
  token: string;
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as requestBody;
    const { token } = reqBody;

    const user = await db.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(user);

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verifyToken: "",
        verifyTokenExpiry: new Date(),
      },
    });

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Handle the case where error is not an instance of Error
      // For example, you might want to log the error or throw a new Error with a generic message
      console.error("An unknown error occurred:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
