"use client";

import React, { useEffect, useState } from "react";
import {
  Toolbar,
  AppBar,
  Grid,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

type userData = {
  id: string;
  email: string;
  username: string;
};

type response = {
  data: {
    data: userData;
  };
};

function Navbar() {
  const [value, setValue] = useState(0);
  const [data, setData] = useState<userData>();
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      setData(undefined);
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        console.error("An unknown error occurred:", error);
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response: response = await axios.get("/api/users/getuser");

        if (response.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    void getUser();
  }, [value]);

  return (
    <AppBar sx={{ background: "white", color: "black" }}>
      <Toolbar>
        <Grid sx={{ placeItems: "center" }} container>
          <Grid item xs={2}>
            <Typography fontWeight="bold">ECOMMERCE</Typography>
          </Grid>
          <Grid item xs={8}>
            <Tabs
              indicatorColor="secondary"
              textColor="inherit"
              value={value}
              onChange={(e, val: number) => setValue(val)}
            >
              <Tab label="Categories"></Tab>
              <Tab label="Sale"></Tab>
              <Tab label="Clearnce"></Tab>
              <Tab label="New Stock"></Tab>
              <Tab label="Trending"></Tab>
            </Tabs>
          </Grid>
          <Grid item xs={0.3}>
            <SearchIcon />
          </Grid>
          <Grid item xs={0.3}>
            <ShoppingCartIcon />
          </Grid>

          <Grid item xs={1}>
            <Box display="flex">
              {data ? (
                <Button
                  sx={{
                    marginLeft: "auto",
                    backgroundColor: "black", // Set the background color to black
                    color: "white", // Set the text color to white
                    "&:hover": {
                      backgroundColor: "darkgray", // Optional: Change the background color on hover
                    },
                  }}
                  onClick={logout}
                  variant="contained"
                >
                  LOGOUT
                </Button>
              ) : (
                <Button
                  sx={{
                    marginLeft: "auto",
                    backgroundColor: "black", // Set the background color to black
                    color: "white", // Set the text color to white
                    "&:hover": {
                      backgroundColor: "darkgray", // Optional: Change the background color on hover
                    },
                  }}
                  onClick={() => {
                    router.push("/login");
                  }}
                  variant="contained"
                >
                  LOG IN
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
