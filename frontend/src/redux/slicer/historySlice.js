import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url_api = "http://localhost:2001";

// get login history
export const getLoginHistory = createAsyncThunk(
  "auth/user/history",
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url_api}/api/auth/history`, {
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
  }
);

// delete history
export const deleteHistory = createAsyncThunk(
  "delete/history",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${url_api}/api/history/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Terjadi kesalahan saat menghapus riwayat.");
      }
    }
  }
);

const initialState = {
  loginHistory: {},
};

const historySlice = createSlice({
  name: "history",
  initialState,

  extraReducers: (builder) => {
    // get login history
    builder
      .addCase(getLoginHistory.pending, (state) => {})
      .addCase(getLoginHistory.fulfilled, (state, action) => {
        state.loginHistory = action.payload;
      })
      .addCase(getLoginHistory.rejected, (state, action) => {});

    builder
      .addCase(deleteHistory.pending, (state) => {})
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.loginHistory = action.payload;
      })
      .addCase(deleteHistory.rejected, (state, action) => {});
  },
});

export default historySlice.reducer;
