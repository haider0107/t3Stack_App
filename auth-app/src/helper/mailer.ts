import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { db } from "~/server/db";
import { generateEightDigitNumber } from "./randomGenerator";

const emailBody = (
  emailType: string,
  randomDigit: string,
  hashedToken: string,
) => {
  if (emailType === "VERIFY") {
    return `<p>${randomDigit}<br>Enter this 8 digit number to acticate your email.</p>`;
  } else if (emailType === "RESET") {
    return `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to reset your password
    or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
    </p>`;
  }
};

interface params {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: params) => {
  try {
    let hashedToken = "",
      randomDigit = "";

    // Condition to verify email type
    if (emailType === "VERIFY") {
      randomDigit = generateEightDigitNumber();

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          verifyToken: randomDigit,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === "RESET") {
      hashedToken = await bcryptjs.hash(userId, 10);

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
        //TODO: add these credentials to .env file
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailBody(emailType, randomDigit, hashedToken),
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
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
