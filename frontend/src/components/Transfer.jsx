import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Box, Container, CircularProgress, Button } from "@mui/material";
import { FaLocationArrow, FaUserLock } from "react-icons/fa";
import { PiNumberSquareNineFill } from "react-icons/pi";
import { findCertificateByNumber } from "../redux/slicer/certificateSlice";
import { getUsers } from "../redux/slicer/userSlice";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { MdOutlineKey } from "react-icons/md";
import { BiSolidUserBadge } from "react-icons/bi";

export default function Transfer() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const certificates = useSelector(
    (state) => state.certificates.certificates.data
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const newOwnerField = useRef();
  const { number } = useParams();
  const [currentOwner, setCurrentOwner] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2001/api/user/filter?full_name=${searchTerm}`
        );
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoggedIn && selectedUser && selectedUser?._id) {
      try {
        const transferPayload = {
          currentOwnerPublicKey: currentOwner.public_key,
          currentOwnerPrivateKey: currentOwner.private_key,
          newOwner: newOwnerField.current.value,
          newUserId: selectedUser._id,
        };
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:2001/api/certificates/transfer-owner/${number}`,
          transferPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Credentials": true,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        const createResponse = response.data;

        if (createResponse && createResponse.status) {
          enqueueSnackbar(`Success`, {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "center" },
            autoHideDuration: 2000,
          });
          window.location.href = "/certificate/all";
        } else {
          enqueueSnackbar(`Warning`, {
            variant: "warning",
            anchorOrigin: { vertical: "top", horizontal: "center" },
            autoHideDuration: 2000,
          });
        }
      } catch (error) {
        enqueueSnackbar(`Failed to generate certificate ${error}`, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleClickLink = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/certificate/all");
    }, 1000);
  };

  useEffect(() => {
    dispatch(findCertificateByNumber(number));
  }, [number, dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserRequest = await dispatch(getUsers());
        const currentUserResponse = currentUserRequest.payload;

        if (currentUserResponse.status) {
          setCurrentOwner(currentUserResponse.data.user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    fetchUserData();
  }, [dispatch]);

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
        <Box
          sx={{
            width: "50%",
            transform: "translateY(-60px)",
            height: "300px",
          }}
        >
          <Box className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              type="text"
              placeholder="search"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </Box>
          <Box>
            <Box className="results-list">
              {filteredUsers.map((user, index) => (
                <Button
                  className="search-result"
                  sx={{
                    color: " #2b0342",
                    textTransform: "capitalize",
                    fontWeight: "500",
                  }}
                  key={index}
                  onClick={() => handleUserSelect(user)}
                >
                  {user.full_name}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          className="wrapper wrapper-transfer"
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", padding: "30px 50px" }}
          >
            <h2 style={{ textAlign: "center" }}>Transfer Your Ownership</h2>
            <Box
              sx={{ display: "flex", gap: "20px", justifyContent: "center" }}
            >
              <Box sx={{ width: "50%" }}>
                <Box className="input-box">
                  <span className="icon">
                    <BiSolidUserBadge />
                  </span>
                  <input type="text" value={currentOwner._id} />
                  <label>Current Owner Id</label>
                </Box>
                <Box className="input-box">
                  <span className="icon">
                    <PiNumberSquareNineFill />
                  </span>
                  <input type="text" value={certificates?.number} />
                  <label>Number</label>
                </Box>
                <Box className="input-box">
                  <span className="icon">
                    <FaUserLock />
                  </span>
                  <input type="text" value={certificates?.owner} />
                  <label>Owner</label>
                </Box>
                <Box className="input-box" sx={{ display: "none" }}>
                  <span className="icon">
                    <MdOutlineKey />
                  </span>
                  <input
                    type="password"
                    value={
                      currentOwner && currentOwner.private_key
                        ? currentOwner.private_key
                            .replace(/\r?\n|\r/g, "\\r\\n")
                            .trim()
                        : ""
                    }
                  />
                  <label>Public Key</label>
                </Box>
                <Box className="input-box">
                  <span className="icon">
                    <MdOutlineKey />
                  </span>
                  <input
                    type="password"
                    value={
                      currentOwner && currentOwner.public_key
                        ? currentOwner.public_key
                            .replace(/\r?\n|\r/g, "\\r\\n")
                            .trim()
                        : ""
                    }
                  />
                  <label>Public Key</label>
                </Box>
              </Box>

              <Box sx={{ width: "50%" }}>
                <Box className="input-box">
                  <span className="icon">
                    <BiSolidUserBadge />
                  </span>
                  <input type="text" value={selectedUser?._id} />
                  <label>New Owner Id</label>
                </Box>
                <Box className="input-box">
                  <span className="icon">
                    <PiNumberSquareNineFill />
                  </span>
                  <input type="text" required value={certificates?.number} />
                  <label>Number</label>
                </Box>

                <Box className="input-box">
                  <span className="icon">
                    <FaUserLock />
                  </span>
                  <input type="text" required ref={newOwnerField} />
                  <label>New Owner</label>
                </Box>
                <Box className="input-box">
                  <span className="icon">
                    <FaUserLock />
                  </span>
                  <input
                    type="password"
                    value={
                      selectedUser && selectedUser.public_key
                        ? selectedUser.public_key
                            .replace(/\r?\n|\r/g, "\\r\\n")
                            .trim()
                        : ""
                    }
                  />
                  <label>New Owner Public Key</label>
                </Box>
              </Box>
            </Box>
            <Button
              sx={{
                width: "100%",
                background: "#2b0342",
                color: "#fff",
                textTransform: "capitalize",
                fontWeight: "600",
                "&:hover": {
                  background: "#2b0342",
                },
              }}
              type="submit"
            >
              Send
            </Button>

            <Box className="login-register" sx={{ marginTop: "10px" }}>
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
      </Container>
    </>
  );
}
