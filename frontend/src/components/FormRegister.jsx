import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../redux/slicer/userSlice";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { Box, Container, Button, CircularProgress } from "@mui/material";
import { TbMailFilled } from "react-icons/tb";
import { FaEyeSlash, FaEye, FaLocationArrow } from "react-icons/fa";
import { MdOutlineDialpad } from "react-icons/md";
import {
  PiIdentificationCardFill,
  PiIdentificationBadgeFill,
} from "react-icons/pi";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const fullnameField = useRef();
  const usernameField = useRef();
  const emailField = useRef();
  const passwordField = useRef();
  const phoneNumberField = useRef();
  const nikField = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickLink = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/user/login";
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerPayload = {
        full_name: fullnameField.current.value,
        username: usernameField.current.value,
        nik: nikField.current.value,
        email: emailField.current.value,
        password: passwordField.current.value,
        phone_number: phoneNumberField.current.value,
      };

      const response = await dispatch(register(registerPayload));
      const createResponse = response.payload;

      if (createResponse && createResponse.status) {
        enqueueSnackbar(`${createResponse.message}`, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        navigate("/user/login");
      }
    } catch (error) {
      enqueueSnackbar("Failed to sign up user", {
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
        <Box className="wrapper wrapper-register">
          <Box className="form-box register">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <PiIdentificationCardFill />
                    </span>
                    <input type="text" ref={fullnameField} required />
                    <label>Fullname</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <PiIdentificationBadgeFill />
                    </span>
                    <input type="text" ref={usernameField} required />
                    <label>Username</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <PiIdentificationBadgeFill />
                    </span>
                    <input type="text" ref={nikField} required />
                    <label>Nik</label>
                  </Box>
                </Box>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <TbMailFilled />
                    </span>
                    <input type="email" ref={emailField} required />
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
                    <input required defaultValue="+62" ref={phoneNumberField} />
                    <label>Phone Number</label>
                  </Box>
                </Box>
              </Box>
              <button type="submit" className="btn">
                Sign Up
              </button>

              <Box className="login-register">
                <p>
                  Already have an account?
                  <Link
                    onClick={handleClickLink}
                    className="login-link"
                    style={{ marginLeft: "10px" }}
                  >
                    Sign In
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
