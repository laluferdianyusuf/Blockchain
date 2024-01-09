import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ownershipHistory } from "../redux/slicer/certificateSlice";
import {
  Box,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { getUsers } from "../redux/slicer/userSlice";
import { useSnackbar } from "notistack";
import QRCode from "qrcode.react";

export default function OwnerHistory() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserRequest = await dispatch(getUsers());
        const currentUserResponse = currentUserRequest.payload;

        if (currentUserResponse.status) {
          setUser(currentUserResponse.data.user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    fetchUserData();
  }, [dispatch]);

  const handleSearchOwnershipHistory = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (number) {
        setLoading(true);

        try {
          const response = await dispatch(ownershipHistory(number));
          if (response.payload && response.payload.data) {
            const certificate = response.payload.data;
            console.log(searchResult.previousOwner);

            enqueueSnackbar("Certificate found", {
              variant: "success",
              anchorOrigin: { vertical: "top", horizontal: "center" },
              autoHideDuration: 2000,
            });
            setSearchResult(certificate);
          } else {
            enqueueSnackbar("Certificate not found", {
              variant: "error",
              anchorOrigin: { vertical: "top", horizontal: "center" },
              autoHideDuration: 2000,
            });
            setSearchResult([]);
          }
        } catch (error) {
          console.error("Error searching for certificate number:", error);
          setSearchResult([]);
        } finally {
          setLoading(false);
        }
      } else {
        enqueueSnackbar("Please enter a valid certificate number.", {
          variant: "warning",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    } else {
      enqueueSnackbar("You must log in to access this feature.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    }
  };
  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);

  return (
    <Container sx={{ marginTop: "100px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          borderBottom: "none",
        }}
        className="input-box"
      >
        <input
          type="text"
          placeholder="Search Certificate Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{
            width: "50%",
            borderBottom: "2px solid #2b0342",
            padding: "0 35px 10px 5px",
          }}
        />
        <Button
          onClick={handleSearchOwnershipHistory}
          disabled={loading}
          sx={{
            width: "50%",
            background: "#2b0342",
            color: "#fff",
            textTransform: "capitalize",
            fontWeight: "600",
            "&:hover": {
              background: "#2b0342",
            },
          }}
        >
          Search
        </Button>
      </Box>
      <Box sx={{ marginTop: "80px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Transaction History
        </Typography>

        {searchResult && Object.keys(searchResult) ? (
          <>
            <Typography>
              Transaction: {searchResult.transactionDate}{" "}
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
              <p>Current Owner</p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nomor</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>QR Code</TableCell>
                    <TableCell>Tanggal Terbit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{searchResult.currentOwner?.number}</TableCell>
                    <TableCell>{searchResult.currentOwner?.owner}</TableCell>
                    <TableCell>
                      <QRCode
                        value={searchResult.currentOwnerHash}
                        size={80}
                        fgColor="black"
                        bgColor="transparent"
                        style={{ marginBottom: "20px" }}
                      />
                    </TableCell>
                    <TableCell>
                      {searchResult.currentOwner?.issueDate.split("T")[0]}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
              <p>Previous Owner</p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nomor</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>QR Code</TableCell>
                    <TableCell>Tanggal Terbit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{searchResult.previousOwner?.number}</TableCell>
                    <TableCell>{searchResult.previousOwner?.owner}</TableCell>
                    <TableCell>
                      <QRCode
                        value={searchResult.previousOwnerHash}
                        size={80}
                        fgColor="black"
                        bgColor="transparent"
                        style={{ marginBottom: "20px" }}
                      />
                    </TableCell>
                    <TableCell>
                      {searchResult.previousOwner?.issueDate}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <p style={{ textAlign: "center" }}>No certificates found.</p>
        )}
      </Box>
    </Container>
  );
}
