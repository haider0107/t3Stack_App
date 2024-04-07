"use client";

import React, { useEffect, useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Typography, Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (newValue: string) => {
    setOtp(newValue);
  };

  const verifyEmail = async () => {
    const data = {
      token: otp,
    };
    try {
      const response = await axios.post("/api/users/verifyEmail", data);

      console.log("User Verified", response.data);
      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 45331740

  useEffect(() => {
    if (otp.length === 8) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [otp]);

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        maxWidth={500}
        alignItems="center"
        justifyContent="center"
        margin="auto"
        marginTop={10}
        padding={3}
        borderRadius={5}
        boxShadow={"5px 5px 10px #ccc"}
        sx={{
          ":hover": {
            boxShadow: "10px 10px 20px #ccc",
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          padding={3}
          textAlign="center"
        >
          Verify your email
        </Typography>

        <Typography
          variant="body1"
          padding={1}
          textAlign="center"
          marginBottom={3}
        >
          Enter 8 digit code send on your email
        </Typography>
        <MuiOtpInput value={otp} onChange={handleChange} length={8} />

        <Button
          sx={{
            marginTop: 3,
            backgroundColor: "black", // Set the background color to black
            color: "white", // Set the text color to white
            "&:hover": {
              backgroundColor: "darkgray", // Optional: Change the background color on hover
            },
          }}
          disabled={buttonDisabled}
          onClick={verifyEmail}
          variant="contained"
        >
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default VerifyEmail;
