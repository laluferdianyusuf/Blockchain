import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url_api = "http://localhost:2001";

// Create a new certificate
export const generateCertificate = createAsyncThunk(
  "certificate/generateCertificate",
  async (createData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url_api}/api/certificates/generate`,
        createData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// transfer ownership
export const transferOwner = createAsyncThunk(
  "certificate/transferOwner",
  async (createData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${url_api}/api/certificates/transfer/owner`,
        createData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Get certificate by number
export const findCertificateByNumber = createAsyncThunk(
  "certificate/findCertificateByNumber",
  async (number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url_api}/api/certificates/${number}`,
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
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Get certificate transaction history
export const ownershipHistory = createAsyncThunk(
  "certificate/ownership-history",
  async (number) => {
    try {
      const response = await axios.get(
        `${url_api}/api/certificates/owner/history/${number}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// get certificate by user id
export const getCertificatesByUserId = createAsyncThunk(
  "certificate/getCertificatesByUserId",
  async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url_api}/api/certificates/user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Credentials": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const initialState = {
  certificates: {
    loading: false,
    error: null,
    data: {
      certificates: [],
    },
  },
};

const certificateSlice = createSlice({
  name: "certificate",
  initialState,

  extraReducers: (builder) => {
    // Generate a new certificate
    builder
      .addCase(generateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.createResult = action.payload;
      })
      .addCase(generateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Transfer Ownership
    builder
      .addCase(transferOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferOwner.fulfilled, (state, action) => {
        state.createResult = action.payload;
      })
      .addCase(transferOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get certificate by number
    builder
      .addCase(findCertificateByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findCertificateByNumber.fulfilled, (state, action) => {
        state.certificates = action.payload;
        state.loading = false;
      })
      .addCase(findCertificateByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ownership history
    builder
      .addCase(ownershipHistory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ownershipHistory.fulfilled, (state, action) => {
        state.certificates = action.payload;
        state.loading = false;
      })
      .addCase(ownershipHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get certificates by user ID
    builder
      .addCase(getCertificatesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCertificatesByUserId.fulfilled, (state, action) => {
        state.certificates = action.payload;
        state.loading = false;
      })
      .addCase(getCertificatesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default certificateSlice.reducer;
