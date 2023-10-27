import React from "react";
import { Typography, Container, Box } from "@mui/material";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function LandingPage() {
  return (
    <>
      <Box>
        <Navbar />
      </Box>

      <Container
        sx={{
          display: "flex",
          gap: "20px",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box>
          <Carousel>
            <div>
              <img
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fblockchain&psig=AOvVaw2KD-agborqGkT5ILDPfFZc&ust=1698066385366000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCKiYurbciYIDFQAAAAAdAAAAABAE"
                alt=""
              />
              <p className="legend">Legend 1</p>
            </div>
            <div>
              <img src="" alt="" />
              <p className="legend">Legend 2</p>
            </div>
            <div>
              <img src="" alt="" />
              <p className="legend">Legend 3</p>
            </div>
          </Carousel>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Box>
            <Link
              to="/certificate/search"
              style={{
                width: "150px",
                height: "200px",
                background: "red",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                fontSize: "60px",
              }}
            >
              <FiSearch />
            </Link>
            <Typography sx={{ textAlign: "center" }}>Search</Typography>
          </Box>
          <Box>
            <Link
              to="/user/certificate/all"
              style={{
                width: "150px",
                height: "200px",
                background: "red",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                fontSize: "60px",
              }}
            ></Link>
            <Typography sx={{ textAlign: "center" }}>Validate</Typography>
          </Box>
          <Box>
            <Link
              to="/certificate/generate"
              style={{
                width: "150px",
                height: "200px",
                background: "red",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                fontSize: "60px",
              }}
            ></Link>
            <Typography sx={{ textAlign: "center" }}>Generate</Typography>
          </Box>
          <Box>
            <Link
              to="/user/all"
              style={{
                width: "150px",
                height: "200px",
                background: "red",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                fontSize: "60px",
              }}
            ></Link>
            <Typography sx={{ textAlign: "center" }}>User</Typography>
          </Box>
          <Box>
            <Link
              to="/certificate/owner/history"
              style={{
                width: "150px",
                height: "200px",
                background: "red",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                fontSize: "60px",
              }}
            ></Link>
            <Typography sx={{ textAlign: "center" }}>Swapping</Typography>
          </Box>
          <Box>
            <Link
              to="/certificate/owner/history"
              style={{
                width: "150px",
                height: "200px",
                background: "red",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                fontSize: "60px",
              }}
            ></Link>
            <Typography sx={{ textAlign: "center" }}>History</Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}
