import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import { getUsers } from "../redux/slicer/userSlice";
import { getLoginHistory, deleteHistory } from "../redux/slicer/historySlice";

export default function ProfileUser() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    private_key: "",
  });
  const [loginHistory, setLoginHistory] = useState([]);

  const handleDeleteHistory = async (id) => {
    console.log(id);
    if (id) {
      const success = await dispatch(deleteHistory(id));
      if (success) {
        setLoginHistory((prevHistory) =>
          prevHistory.filter((entry) => entry._id !== id)
        );
      }
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      const historyRequest = await dispatch(getLoginHistory());
      if (historyRequest.payload.status) {
        setLoginHistory(historyRequest.payload.data);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: "110px" }}>
      {isLoggedIn ? (
        <>
          <Box mt={6} display="flex" justifyContent="space-between">
            <Box flex={1} pr={2}>
              <Paper
                elevation={3}
                sx={{ padding: 4, borderRadius: 12, background: "#f5f5f5" }}
              >
                <Typography variant="h4" color="primary">
                  Profile
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box
                    bgcolor="primary.main"
                    color="white"
                    width={70}
                    height={70}
                    borderRadius="50%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    fontSize="2rem"
                  >
                    {user.username.slice(0, 1)}
                  </Box>
                  <Box ml={2}>
                    <Typography variant="h6" color="primary">
                      {user.username}
                    </Typography>
                    <Typography color="textSecondary">{user.email}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Box flex={1} pl={2} sx={{ width: "60%" }}>
              <Paper
                elevation={3}
                sx={{ padding: 4, borderRadius: 12, background: "#f5f5f5" }}
              >
                <Typography variant="h4" color="primary">
                  Private Key
                </Typography>
                <Box
                  border="1px solid #ccc"
                  padding={2}
                  borderRadius={8}
                  bgcolor="white"
                  sx={{
                    overflowX: "auto",
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {user.private_key.replace(/\r?\n|\r/g, "\\r\\n").trim()}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>

          <Box
            mt={4}
            sx={{
              overflowY: "auto",
              height: "250px",
              "::-webkit-scrollbar": {
                display: "none",
              },
              borderRadius: "20px",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                background: "#f5f5f5",
              }}
            >
              <Typography variant="h4" color="primary">
                Login History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Device Name</TableCell>
                      <TableCell>User Agent</TableCell>
                      <TableCell>Login Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  {loginHistory && Array.isArray(loginHistory) && (
                    <TableBody>
                      {loginHistory.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.deviceName}</TableCell>
                          <TableCell>{entry.userAgent}</TableCell>
                          <TableCell>{entry.loginTime}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDeleteHistory(entry._id)}
                            >
                              Log Out
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </>
      ) : (
        <Typography variant="h4" color="primary">
          Please log in to view your profile.
        </Typography>
      )}
    </Container>
  );
}
