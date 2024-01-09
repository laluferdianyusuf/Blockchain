import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getCertificatesByUserId } from "../redux/slicer/certificateSlice";
import { Link } from "react-router-dom";
import QRCode from "qrcode.react";

export default function ProfileUser() {
  const dispatch = useDispatch();
  const certificates = useSelector((state) => state.certificates);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    private_key: "",
  });
  const [loginHistory, setLoginHistory] = useState([]);

  const handleDeleteHistory = async (id) => {
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

  useEffect(() => {
    dispatch(getCertificatesByUserId(user.id));
  }, [dispatch, user.id]);

  const handleSeeCertificateLink = (e) => {
    e.preventDefault();
    window.location.href = "/certificate/all";
  };

  const renderCertificates = () => {
    if (
      certificates.certificates.data &&
      certificates.certificates.data.certificates
    ) {
      const certificateData = certificates.certificates.data.certificates;

      return Array.isArray(certificateData)
        ? certificateData.map((certificate, index) => {
            const qrValue = `${certificate.signature}`;
            return (
              <>
                <Paper
                  key={index}
                  sx={{
                    width: "50%",
                    padding: "15px",
                    boxShadow: "0 0 10px rgba(0,0,0,1)",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      margin: "20px 0",
                      fontWeight: "600",
                      fontSize: "8px",
                    }}
                  >
                    Sertifikat Hak Milik Tanah
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      borderBottom: "4px double grey",
                      paddingBottom: "10px",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Nomor Sertifikat : {certificate.number}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      margin: "10px 0",
                      borderBottom: "2px dashed grey",
                      paddingBottom: "10px",
                      fontWeight: "600",
                      fontSize: "8px",
                    }}
                  >
                    (Lokasi Sertifikat )
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Provinsi : {certificate.province}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Kabupaten/Kota : {certificate.address}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Kecamatan : {certificate.city}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Desa/Kelurahan : {certificate.address}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      margin: "20px 0",
                      borderBottom: "2px dashed grey",
                      borderTop: "2px dashed grey",
                      padding: "10px 0",
                      fontWeight: "600",
                      fontSize: "8px",
                    }}
                  >
                    (Informasi Properti)
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Nomor Tanah : {certificate.length}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Luas Tanah : {certificate.area}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      margin: "20px 0",
                      borderBottom: "2px dashed grey",
                      borderTop: "2px dashed grey",
                      padding: "10px 0",
                      fontWeight: "600",
                      fontSize: "8px",
                    }}
                  >
                    (Informasi Pemilik dan Catatan)
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Nama Pemilik : {certificate.owner}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Nomor KTP Pemilik : {certificate.nik}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      marginBottom: "20px",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    Tanggal Penerbitan : {certificate.issueDate}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingRight: "30px",
                      borderBottom: "4px double grey",
                      fontWeight: "500",
                      fontSize: "5px",
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: "5px",
                      }}
                    >
                      Tanda tangan Sertifikat:
                    </Typography>
                    <QRCode
                      value={qrValue}
                      size={10}
                      fgColor="grey"
                      bgColor="transparent"
                      style={{ marginBottom: "20px" }}
                    />
                  </Typography>
                </Paper>
              </>
            );
          })
        : "";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "110px" }}>
      {isLoggedIn ? (
        <>
          <Box mt={6} display="flex" justifyContent="space-between">
            <Box flex={1} pr={2}>
              <Paper
                elevation={0}
                sx={{ padding: 4, borderRadius: 5, background: "#f5f5f5" }}
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
                elevation={0}
                sx={{ padding: 4, borderRadius: 5, background: "#f5f5f5" }}
              >
                <Typography variant="h4" color="primary">
                  Private Key
                </Typography>
                <Box
                  padding={2}
                  borderRadius={8}
                  bgcolor="rgba(0, 0,0, 0.05)"
                  sx={{
                    overflowX: "auto",
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      fontSize: "12px",
                    }}
                  >
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
              display: "flex",
              gap: "20px",
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
                width: "69%",
                overflowY: "auto",
                "::-webkit-scrollbar": {
                  display: "none",
                },
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

            <Paper
              elevation={3}
              sx={{
                padding: 4,
                background: "#f5f5f5",
                overflowY: "auto",
                width: "30%",
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Link
                onClick={handleSeeCertificateLink}
                color="primary"
                style={{
                  textDecoration: "none",
                  textTransform: "capitalize",
                  fontSize: "32px",
                }}
              >
                Your Certificate
              </Link>
              <Box sx={{ display: "flex", gap: "10px" }}>
                {renderCertificates()}
              </Box>
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
