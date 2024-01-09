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
    console.log(response);
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

export const filterUsers = createAsyncThunk(
  "user/filter",
  async (filterParams, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url_api}/api/user/filter`, {
        params: filterParams,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  users: {},
  filteredUsers: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,

  extraReducers: (builder) => {
    // register
    builder
      .addCase(register.pending, (state) => {})
      .addCase(register.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(register.rejected, (state, action) => {});

    // login
    builder
      .addCase(login.pending, (state) => {})
      .addCase(login.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(login.rejected, (state, action) => {});

    // get user
    builder
      .addCase(getUsers.pending, (state) => {})
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {});

    // Filter user
    builder
      .addCase(filterUsers.pending, (state) => {})
      .addCase(filterUsers.fulfilled, (state, action) => {
        state.filteredUsers = action.payload;
      })
      .addCase(filterUsers.rejected, (state, action) => {});
  },
});

export default userSlice.reducer;
