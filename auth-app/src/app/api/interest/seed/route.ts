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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
