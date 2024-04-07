import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Typography,
  Pagination,
  Box,
} from "@mui/material";
import axios from "axios";

type DataRow = {
  id: number;
  name: string;
};

type DataRowUser = {
  data: {
    listUserIntrest: {
      id: number;
      userId: string;
      interestId: number;
    }[];
  };
};

type response = {
  data: {
    data: DataRow[];
    totalData: number;
  };
};

type DataResponse = {
  data: DataRow[];
  totalCount: number;
};

function InterestTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [data, setData] = useState<DataRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRadio = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const urlEndpoint = event.target.checked
      ? "/api/interest/users"
      : `/api/interest/users?id=${id}`;

    try {
      if (event.target.checked) {
        setSelectedIds((prev) => [...prev, id]);
        const data = {
          id,
        };

        await axios.post(urlEndpoint, data);
      } else {
        setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        await axios.delete(urlEndpoint);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    const fetchUserInterest = async () => {
      try {
        const response: DataRowUser = await axios.get("/api/interest/users");

        const ids: number[] = response.data.listUserIntrest.map(
          (item) => item.interestId,
        );

        setSelectedIds(ids);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInterest();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response: response = await axios.get(
          `/api/interest/fetch?page=${page}&pageSize=${rowsPerPage}`,
        );

        setData(response.data.data);
        setTotalCount(response.data.totalData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTableData();
  }, [page, rowsPerPage]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth={650}
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
      <Typography variant="h5" fontWeight="bold" padding={3} textAlign="center">
        Please mark your interests!
      </Typography>
      <Typography marginBottom={3}>We will keep you notified.</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Radio
                    checked={selectedIds.includes(row.id)}
                    onChange={(e) => handleRadio(e, row.id)}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          count={Math.ceil(totalCount / rowsPerPage)}
          page={page}
          onChange={handleChange}
        />
      </TableContainer>
    </Box>
  );
}

export default InterestTable;
