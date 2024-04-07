import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { signupSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import { sendEmail } from "~/helper/mailer";

interface requestBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const reqBody: requestBody = await request.json();

    // validate request body
    signupSchema.parse(reqBody);

    const { username, email, password } = reqBody;

    //check if user already exists
    const user = await db.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    const savedUser = await db.user.create({
      data: newUser,
      select: {
        email: true,
        username: true,
        id: true,
      },
    });
    console.log(savedUser);

    //send verification email

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser.id });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
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
