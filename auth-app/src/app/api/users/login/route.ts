import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { loginSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import jwt from "jsonwebtoken";
import { sendEmail } from "~/helper/mailer";

interface requestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const reqBody: requestBody = await request.json();

    loginSchema.parse(reqBody);

    const { email, password } = reqBody;

    // Check if exist
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User or password incorrect" },
        { status: 400 },
      );
    }

    // validate password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "User or password incorrect" },
        { status: 400 },
      );
    }

    // jwt payload
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // jwt token generation
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // creating response
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // sendEmail({ email: user.email, emailType: "VERIFY", userId: user.id });

    // Creating cookie
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      // Handle other errors
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }
}
