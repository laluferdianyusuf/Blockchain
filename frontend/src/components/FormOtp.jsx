import React, { useState, createRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../redux/slicer/userSlice";
import { useSnackbar } from "notistack";
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { TbMailFilled } from "react-icons/tb";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { MdOutlineDialpad } from "react-icons/md";

export default function OtpForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const email = location.state.email;
  const password = location.state.password;
  const phone_number = location.state.phone_number;

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const otpFields = Array(6)
    .fill("")
    .map((_, index) => createRef());

  const handleOtpInput = (index, e) => {
    if (e.target.value.length >= 1) {
      if (index < otpFields.length - 1) {
        otpFields[index + 1].current.focus();
      }
    } else if (e.target.value.length === 0) {
      if (index > 0) {
        otpFields[index - 1].current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otp_code = otpFields.map((field) => field.current.value).join("");
      const loginPayload = {
        email,
        password,
        phone_number,
        otp_code,
      };
      const response = await dispatch(login(loginPayload));
      const createResponse = response.payload;

      if (createResponse && createResponse.status) {
        localStorage.setItem("token", createResponse.data.token);
        enqueueSnackbar(`${createResponse.message}`, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        navigate("/");
      }
    } catch (error) {
      enqueueSnackbar("Failed to send otp", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    }
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
        <Box className="wrapper wrapper-otp">
          <Box className="form-box login">
            <h2>Verify Otp</h2>
            <form onSubmit={handleSubmit}>
              <Box
                className="input-box"
                sx={{ position: "absolute", display: "none" }}
              >
                <span className="icon">
                  <TbMailFilled />
                </span>
                <input type="text" defaultValue={email} required />
                <label>Email</label>
              </Box>
              <Box
                className="input-box"
                sx={{ position: "absolute", display: "none" }}
              >
                <span className="icon">
                  <Button
                    onClick={handleShowPassword}
                    sx={{ minWidth: "20px", padding: "0" }}
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        style={{
                          fontSize: "1.2em",
                          color: "#2b0342",
                          lineHeight: "57px",
                        }}
                      />
                    ) : (
                      <FaEye
                        style={{
                          fontSize: "1.2em",
                          color: "#2b0342",
                          lineHeight: "57px",
                        }}
                      />
                    )}
                  </Button>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue={password}
                  required
                />
                <label>Password</label>
              </Box>
              <Box
                className="input-box"
                sx={{ position: "absolute", display: "none" }}
              >
                <span className="icon">
                  <MdOutlineDialpad />
                </span>
                <input defaultValue={phone_number} required />
                <label>Phone Number</label>
              </Box>
              <Typography
                sx={{
                  color: "#2b0342",
                  marginTop: "30px",
                  paddingLeft: "5px",
                }}
              >
                Otp send to {phone_number.slice(0, 3)}*******
                {phone_number.slice(10, 14)} , check your phone and verify it
              </Typography>
              <Box
                className="input-box-otp"
                sx={{
                  margin: "10px 0 30px 0",
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                }}
              >
                {otpFields.map((field, index) => (
                  <input
                    key={index}
                    ref={field}
                    required
                    onInput={(e) => handleOtpInput(index, e)}
                  />
                ))}
              </Box>

              <button type="submit" className="btn">
                Sign In
              </button>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}
