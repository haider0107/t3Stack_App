import { getDataFromToken } from "~/helper/tokenDecoder";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const listUserIntrest = await db.userInterest.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      message: "Fetched successfully",
      listUserIntrest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const reqBody = await request.json();
    const { id } = reqBody;

    const newInterest = await db.userInterest.create({
      data: {
        userId: userId,
        interestId: Number(id),
      },
    });

    return NextResponse.json({
      mesaaage: "Interest Added",
      data: newInterest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const interstId = request.nextUrl.searchParams.get("id");

    const findUserInterest = await db.userInterest.findFirst({
      where: {
        userId: userId,
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

    return NextResponse.json({
      mesaaage: "User Interest Deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
