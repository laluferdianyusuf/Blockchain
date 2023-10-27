import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url_api = "http://localhost:2001";

// register
export const register = createAsyncThunk("auth/register", async (user) => {
  try {
    const response = await axios.post(`${url_api}/api/auth/register`, user, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
});

// login
export const login = createAsyncThunk("auth/login", async (login) => {
  try {
    const response = await axios.post(`${url_api}/api/auth/login`, login, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
});

export const getUsers = createAsyncThunk("auth/user/me", async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url_api}/api/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
});

const initialState = {
  users: {
    loading: false,
    error: null,
    data: {
      user: [],
      loginHistory: {},
    },
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,

  extraReducers: (builder) => {
    // register
    builder
      .addCase(register.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error.message;
      });

    // login
    builder
      .addCase(login.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error.message;
      });

    // get user
    builder
      .addCase(getUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data.user = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
