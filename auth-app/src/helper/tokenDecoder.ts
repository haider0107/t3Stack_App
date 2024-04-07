import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface decodeToken {
  id: string;
  username: string;
  email: string;
}

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value ?? "";
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      const decodedToken = decoded as decodeToken;
      return decodedToken.id;
    } else {
      // Handle the case where the decoded value is not an object or doesn't have an 'id' property
      console.error("Decoded token is not of the expected type");
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      // Handle the case where error is not an instance of Error
      // For example, you might want to log the error or throw a new Error with a generic message
      console.error("An unknown error occurred:", error);
      throw new Error("An unknown error occurred");
    }
  }
};
