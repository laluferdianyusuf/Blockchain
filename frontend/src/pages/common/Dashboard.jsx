import React from "react";
import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import image from "../../assets/Images/Image-left.png";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="custom-shape-divider-top-1696857176">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <Container fixed className="dashboard">
        <div
          sx={{ paddingTop: "20px", paddingBottom: "20px", position: "fixed" }}
        >
          <Navbar />
        </div>
      </Container>
      <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "80px",
            position: "relative",
          }}
        >
          <Box sx={{ padding: "100px 0 0 100px" }}>
            <Box>
              <Typography
                className="text-tittle-first"
                sx={{
                  textAlign: "center",
                  fontSize: "40px",
                  fontWeight: "800",
                  color: "orange",
                  lineHeight: "32px",
                }}
              >
                YOUR CERTIFICATE
              </Typography>
              <Typography
                className="text-tittle-two"
                sx={{
                  textAlign: "center",
                  fontSize: "72px",
                  fontWeight: "800",
                  color: "darkblue",
                }}
              >
                Can Be Secure
              </Typography>
              <Typography sx={{ padding: "50px 50px 50px 80px" }}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel,
                sunt expedita. Dolorum, recusandae libero adipisci porro quidem
                at doloremque impedit.
              </Typography>
            </Box>
            <Link
              to="/certificate/create"
              style={{
                marginLeft: "80px",
                border: "1px solid #F53C4D",
                borderRadius: "20px",
                padding: "5px 20px",
                textTransform: "Capitalize",
                fontWeight: "600",
                color: "white",
                background: "#F53C4D",
                textDecoration: "none",
              }}
            >
              Learn More
            </Link>
          </Box>
          <Box>
            <img
              src={image}
              alt=""
              style={{ width: "700px", padding: "30px 100px 0 0" }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
