import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slicer/userSlice";
import { useSnackbar } from "notistack";
import { Box, Container, Button, CircularProgress } from "@mui/material";
import { TbMailFilled } from "react-icons/tb";
import { FaEyeSlash, FaEye, FaLocationArrow } from "react-icons/fa";
import { MdOutlineDialpad } from "react-icons/md";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const emailField = useRef();
  const passwordField = useRef();
  const phoneNumberField = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickLink = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/user/register";
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginPayload = {
        email: emailField.current.value,
        password: passwordField.current.value,
        phone_number: phoneNumberField.current.value,
      };
      const response = await dispatch(login(loginPayload));
      const createResponse = response.payload;

      if (createResponse && createResponse.status) {
        enqueueSnackbar(`${createResponse.message}`, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        navigate("/user/verify/otp", {
          state: {
            email: emailField.current.value,
            password: passwordField.current.value,
            phone_number: phoneNumberField.current.value,
          },
        });
      } else {
        enqueueSnackbar(`${createResponse.message}`, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Failed to send otp & sign in", {
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
        <Box className="wrapper wrapper-login">
          <Box className="form-box login">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
              <Box className="input-box">
                <span className="icon">
                  <TbMailFilled />
                </span>
                <input type="text" ref={emailField} required />
                <label>Email</label>
              </Box>
              <Box className="input-box">
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
                  ref={passwordField}
                  required
                />
                <label>Password</label>
              </Box>
              <Box className="input-box">
                <span className="icon">
                  <MdOutlineDialpad />
                </span>
                <input ref={phoneNumberField} defaultValue="+62" required />
                <label>Phone Number</label>
              </Box>

              <button type="submit" className="btn">
                Sign In
              </button>

              <Box className="login-register">
                <span>
                  Don't have an account?
                  <Link
                    onClick={handleClickLink}
                    className="register-link"
                    style={{ marginLeft: "10px" }}
                  >
                    Sign Up{" "}
                    {isLoading ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginLeft: "5px",
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
                </span>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}
