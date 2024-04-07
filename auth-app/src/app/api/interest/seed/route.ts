import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    // const data = Array.from({ length: 100 }).map(() => ({
    //   name: faker.commerce.product(),
    // }));

    // await db.interestTable.createMany({
    //   data,
    // });

    return NextResponse.json({
      mesaaage: "Product Added",
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
