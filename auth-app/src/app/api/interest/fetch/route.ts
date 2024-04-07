import { getDataFromToken } from "~/helper/tokenDecoder";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const page = request.nextUrl.searchParams.get("page");
    const pageSize = request.nextUrl.searchParams.get("pageSize");

    const data = await getPaginatedData(Number(page), Number(pageSize));

    const totalData = await getTotal();

    return NextResponse.json({
      data,
      totalData,
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

async function getPaginatedData(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const data = await db.interestTable.findMany({
    skip: skip,
    take: take,
    // Include any other query options you need
  });

  return data;
}

async function getTotal() {
  const totalRecords = await db.interestTable.count();
  //   const totalPages = Math.ceil(totalRecords / pageSize);
  return totalRecords;
}
