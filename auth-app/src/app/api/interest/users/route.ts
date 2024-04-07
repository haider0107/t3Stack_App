import { getDataFromToken } from "~/helper/tokenDecoder";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    let listUserIntrest;

    if (userId) {
      listUserIntrest = await db.userInterest.findMany({
        where: {
          userId: userId,
        },
      });
    }

    return NextResponse.json({
      message: "Fetched successfully",
      listUserIntrest,
    });
  } catch (error) {
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

interface RequestBody {
  id: string; // Adjust the type as necessary
  // Add other properties as needed
}

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const { id } = (await request.json()) as RequestBody;
    // const { id } = reqBody;

    let newInterest;

    if (userId) {
      newInterest = await db.userInterest.create({
        data: {
          userId: userId,
          interestId: Number(id),
        },
      });
    }

    return NextResponse.json({
      mesaaage: "Interest Added",
      data: newInterest,
    });
  } catch (error) {
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

export async function DELETE(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const interstId = request.nextUrl.searchParams.get("id");

    if (userId && interstId) {
      const findUserInterest = await db.userInterest.findFirst({
        where: {
          userId: userId, // TypeScript now knows userId is not null or undefined here
          interestId: Number(interstId),
        },
      });

      if (findUserInterest) {
        await db.userInterest.delete({
          where: {
            id: findUserInterest.id,
          },
        });
      }
    }

    return NextResponse.json({
      mesaaage: "User Interest Deleted successfully",
    });
  } catch (error) {
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
