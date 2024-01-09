import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, styled, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { getUsers } from "../redux/slicer/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";

const StyledNavbar = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  background: #fff;
`;

const Brand = styled(Link)`
  font-size: 1.5em;
  color: darkgreen;
  user-select: none;
  font-weight: 700;
  margin-right: 30px;
`;

const NavLink = styled(Link)`
  font-size: 1em;
  color: #2b0342;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
  align-self: center;
  text-align: center;
`;

const StyledMenuButton = styled(MenuButton)`
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    background: none;
  }
`;

const UserAvatar = styled(Box)`
  border: 2px solid darkgreen;
  border-radius: 40%;
  text-transform: capitalize;
  color: darkgreen;
  font-weight: 800;
  padding: 10px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 50px;

  &:hover {
    background: transparent;
  }
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
  width: 100px;
  height: 45px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1em;
  color: black;
  font-weight: 600;
  transition: 0.5s ease;
  text-align: center;
  align-self: center;
  padding: 5px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: transparent;
  }
`;

const LogoutButton = styled(Button)`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1em;
  color: darkred;
  font-weight: 600;
  transition: 0.5s ease;
  text-align: center;
  align-self: center;
  padding: 5px 20px;
  text-transform: capitalize;
`;

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "" });
  const [showBackButton, setShowBackButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickLink = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/user/profile"); // Menggunakan navigate dari React Router
    }, 1000);
  };

  useEffect(() => {
    const validateLogin = async () => {
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
    validateLogin();
  }, [dispatch]);

  useEffect(() => {
    setShowBackButton(location.pathname !== "/");
  }, [location.pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      enqueueSnackbar("Log out successful", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    }, 1000);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleClickRegister = (e) => {
    e.preventDefault();
    navigate("/user/register");
  };

  return (
    <StyledNavbar>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Brand to="/">Incrypt</Brand>
        <NavLink to="/validate-certificate">Validate</NavLink>
        <NavLink to="/certificate/generate">Generate</NavLink>
        <NavLink to="/certificate/owner/history">History</NavLink>
        <NavLink to="/certificate/all">Certificates</NavLink>
      </Box>
      <Box sx={{ display: "flex" }}>
        {showBackButton && (
          <ButtonLink onClick={handleBackClick}>Back</ButtonLink>
        )}
        {isLoggedIn ? (
          <Dropdown>
            <StyledMenuButton>
              <UserAvatar>
                {isLoading ? (
                  <CircularProgress
                    style={{
                      width: "23px",
                      color: "darkgreen",
                      display: "flex",
                      height: "auto",
                    }}
                  />
                ) : (
                  <Box>
                    <span>{user.username.slice(0, 1)} </span>
                    <span>{user.username.slice(8, 9)} </span>
                  </Box>
                )}
              </UserAvatar>
            </StyledMenuButton>
            <Menu>
              <MenuItem>
                <ButtonLink onClick={handleClickLink}>Profile</ButtonLink>
              </MenuItem>

              <MenuItem>
                <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
              </MenuItem>
            </Menu>
          </Dropdown>
        ) : (
          <>
            {isLoggedIn ? (
              <Dropdown>
                <StyledMenuButton>
                  <UserAvatar>
                    {isLoading ? (
                      <CircularProgress
                        style={{
                          width: "23px",
                          color: "darkgreen",
                          display: "flex",
                          height: "auto",
                        }}
                      />
                    ) : (
                      <Box>
                        <span>{user.username.slice(0, 1)} </span>
                        <span>{user.username.slice(8, 9)} </span>
                      </Box>
                    )}
                  </UserAvatar>
                </StyledMenuButton>
                <Menu>
                  <MenuItem>
                    <ButtonLink onClick={handleClickLink}>Profile</ButtonLink>
                  </MenuItem>
                  <MenuItem>
                    <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
                  </MenuItem>
                </Menu>
              </Dropdown>
            ) : (
              ""
            )}
            {isLoggedIn ? (
              ""
            ) : (
              <Box sx={{ display: "flex" }}>
                <ButtonLink to="/user/login">Sign in</ButtonLink>
                <Button
                  sx={{
                    marginLeft: "10px",
                    textTransform: "none",
                    fontSize: "1em",
                    fontWeight: "600",
                    padding: "5px 20px",
                    border: "2px solid darkgreen",
                    borderRadius: "12px",
                    background: "darkgreen",
                    color: "#fff",
                    "&:hover": {
                      background: "darkgreen",
                    },
                  }}
                  onClick={handleClickRegister}
                >
                  Sign up
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </StyledNavbar>
  );
}
