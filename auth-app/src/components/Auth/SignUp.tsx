"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Typography, Box, Button, TextField } from "@mui/material";
import { toast } from "react-hot-toast";

function SignUp() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/verifyemail");
    } catch (error) {
      //   toast.error(error.message);
      if (error instanceof Error) {
        console.log("Signup failed", error.message);
        toast.error(error.message);
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div>
      <form>
        <Box
          display="flex"
          flexDirection="column"
          maxWidth={400}
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
            Create Your Account
          </Typography>

          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Username"
          />
          <TextField
            margin="normal"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            variant="outlined"
            placeholder="Email"
          />
          <TextField
            margin="normal"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            variant="outlined"
            placeholder="Password"
          />
          <Button
            sx={{
              marginTop: 3,
              backgroundColor: "black", // Set the background color to black
              color: "white", // Set the text color to white
              "&:hover": {
                backgroundColor: "darkgray", // Optional: Change the background color on hover
              },
            }}
            onClick={onSignup}
            disabled={buttonDisabled}
            variant="contained"
          >
            Sign Up
          </Button>
          <Box display="flex" alignItems="center" marginTop={3}>
            <Typography variant="caption"> Have an account ?</Typography>
            <Button
              variant="text"
              sx={{
                "&:hover": {
                  color: "darkblue", // Optional: Change the background color on hover
                },
              }}
              onClick={() =>{
                router.push("/login")
              }}
            >
              Log In
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
}

export default SignUp;
