"use client";
import React, { useEffect } from "react";
import { Typography, Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

type response = {
  data: {
    isVerified: boolean;
  };
};

function Login() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response: response = await axios.post("/api/users/login", user);

      if (response.data.isVerified === false) {
        console.log(response.data);

        router.push("/verifyemail");
        return;
      }

      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/interests");
    } catch (error) {
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
    if (user.email.length > 0 && user.password.length > 0) {
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
            Log In
          </Typography>

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
            disabled={buttonDisabled}
            variant="contained"
            onClick={onLogin}
          >
            Log In
          </Button>
          <Box display="flex" alignItems="center" marginTop={3}>
            <Typography variant="caption">
              Don&lsquo;t have an account ?
            </Typography>
            <Button
              variant="text"
              sx={{
                "&:hover": {
                  color: "darkblue", // Optional: Change the background color on hover
                },
              }}
              onClick={() => {
                router.push("/signup");
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
}

export default Login;
