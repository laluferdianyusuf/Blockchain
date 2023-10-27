import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Container, CircularProgress } from "@mui/material";
import { FaLocationArrow, FaUserLock, FaTree } from "react-icons/fa";
import { FaLocationDot, FaTreeCity } from "react-icons/fa6";
import { MdApproval, MdDateRange } from "react-icons/md";
import {
  PiIdentificationCardFill,
  PiNumberSquareNineFill,
} from "react-icons/pi";
import { BiSolidRuler } from "react-icons/bi";

export default function GenerateForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClickLink = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/certificate/all";
    }, 1000);
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Link
          to="/"
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            fontSize: "1.4em",
            color: "green",
            userSelect: "none",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Incrypt
        </Link>
        <Box className="wrapper wrapper-generate">
          <Box className="form-box register">
            <h2>Generate</h2>
            <form action="#">
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <PiNumberSquareNineFill />
                    </span>
                    <input type="text" required />
                    <label>Number</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <FaUserLock />
                    </span>
                    <input type="text" required />
                    <label>Owner</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <PiIdentificationCardFill />
                    </span>
                    <input type="email" required />
                    <label>Nik</label>
                  </Box>
                </Box>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <MdApproval />
                    </span>
                    <input required />
                    <label>Province</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <FaLocationDot />
                    </span>
                    <input type="text" required />
                    <label>Address</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <FaTreeCity />
                    </span>
                    <input required />
                    <label>City</label>
                  </Box>
                </Box>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <BiSolidRuler />
                    </span>
                    <input required />
                    <label>Length</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <FaTree />
                    </span>
                    <input required />
                    <label>Area</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <MdDateRange />
                    </span>
                    <input required />
                    <label>Issue Date</label>
                  </Box>
                </Box>
              </Box>
              <button type="submit" className="btn">
                Generate
              </button>

              <Box className="login-register">
                <p>
                  See your certificate ?
                  <Link
                    onClick={handleClickLink}
                    className="login-link"
                    style={{ marginLeft: "10px" }}
                  >
                    Certificate
                    {isLoading ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          paddingLeft: "5px",
                        }}
                      >
                        <CircularProgress
                          style={{
                            width: "15px",
                            color: "#31233D",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "0",
                          }}
                        />
                      </span>
                    ) : (
                      <FaLocationArrow
                        style={{ marginLeft: "5px", width: "10px" }}
                      />
                    )}
                  </Link>
                </p>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}
