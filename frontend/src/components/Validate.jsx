import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { validate } from "../redux/slicer/certificateSlice";
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
// import { QrReader } from "react-qr-reader";
import jsQR from "jsqr";

export default function Validate() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [file, setFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

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

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      setQRCodeValue("");
      decodeQRCode(fileContent);

      setImagePreview(fileContent);
    };
    reader.readAsDataURL(selectedFile);
  };

  const decodeQRCode = (imageData) => {
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageDataArray = ctx.getImageData(
        0,
        0,
        image.width,
        image.height
      ).data;
      try {
        const code = jsQR(imageDataArray, image.width, image.height);

        if (code) {
          setQRCodeValue(code.data);
        } else {
          setQRCodeValue("QR code not found");
        }
      } catch (error) {
        console.error("Error decoding QR code:", error);
        setQRCodeValue("Error decoding QR code");
      }
    };
  };

  const handleValidateCertificate = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (hash || qrCodeValue) {
        setLoading(true);

        try {
          const response = await dispatch(validate(hash || qrCodeValue));
          console.log(response);
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
        enqueueSnackbar("Please enter a valid hash.", {
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
          placeholder="Validate Certificate"
          value={hash || qrCodeValue}
          onChange={(e) => setHash(e.target.value)}
          style={{
            width: "50%",
            borderBottom: "2px solid #2b0342",
            padding: "0 35px 10px 5px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            width: "50%",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleValidateCertificate}
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            onClick={() => {
              document.querySelector('input[type="file"]').click();
            }}
            style={{
              boxShadow: "none",
              width: "50%",
              textTransform: "capitalize",
              fontWeight: "600",
              background: "#2b0342",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              "&:hover": {
                background: "#2b0342",
              },
            }}
          >
            <p></p>
            Upload QR{" "}
            {imagePreview && (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img
                src={imagePreview}
                alt="Image Preview"
                style={{ width: "10%" }}
              />
            )}
          </Button>
        </Box>
        {/* <QrReader
          delay={300}
          onError={() => {}}
          onScan={handleScan}
          style={{ width: "100%" }}
        /> */}
      </Box>
      <Box sx={{ marginTop: "80px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "600",
            color: "#2b0342",
          }}
        >
          Search and Validate
        </Typography>

        {searchResult && Object.keys(searchResult) ? (
          <>
            <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nomor</TableCell>
                    <TableCell>Alamat</TableCell>
                    <TableCell>Kota</TableCell>
                    <TableCell>Provinsi</TableCell>
                    <TableCell>QR Code</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{searchResult.number}</TableCell>
                    <TableCell>{searchResult.address}</TableCell>
                    <TableCell>{searchResult.city}</TableCell>
                    <TableCell>{searchResult.province}</TableCell>
                    <TableCell>
                      <QRCode
                        value={searchResult.hash}
                        size={80}
                        fgColor="black"
                        bgColor="transparent"
                        style={{ marginBottom: "20px" }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: "600" }}>
                      {searchResult.status ? "Invalid" : "Valid"}
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
