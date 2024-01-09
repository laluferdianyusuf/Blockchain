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
  async (number, { createData }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${url_api}/api/certificates/transfer-owner/${number}`,
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
      console.log(response);
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
        `${url_api}/api/v1/certificates/${number}`,
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

// Get certificate transaction history
export const ownershipHistory = createAsyncThunk(
  "certificate/ownership-history",
  async (number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url_api}/api/certificates/owner/history/${number}`,
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

// get certificate by user id
export const getCertificatesByUserId = createAsyncThunk(
  "certificate/getCertificatesByUserId",
  async (user_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url_api}/api/certificates/user/${user_id}`,
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

// get certificates
export const getAllCertificates = createAsyncThunk(
  "certificate/getAllCertificates",
  async () => {
    try {
      const response = await axios.get(`${url_api}/v1/api/certificates-all`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Get validate certificates
export const validate = createAsyncThunk(
  "certificate/validate",
  async (hash) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url_api}/v1/api/certificates/${hash}`,
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

const initialState = {
  certificates: {},
};

const certificateSlice = createSlice({
  name: "certificate",
  initialState,

  extraReducers: (builder) => {
    // Generate a new certificate
    builder
      .addCase(generateCertificate.pending, (state) => {})
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(generateCertificate.rejected, (state, action) => {});

    // Transfer Ownership
    builder
      .addCase(transferOwner.pending, (state) => {})
      .addCase(transferOwner.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(transferOwner.rejected, (state, action) => {});

    // Get certificate by number
    builder
      .addCase(findCertificateByNumber.pending, (state) => {})
      .addCase(findCertificateByNumber.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(findCertificateByNumber.rejected, (state, action) => {});

    // ownership history
    builder
      .addCase(ownershipHistory.pending, (state, action) => {})
      .addCase(ownershipHistory.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(ownershipHistory.rejected, (state, action) => {});

    // Get certificates by user ID
    builder
      .addCase(getCertificatesByUserId.pending, (state) => {})
      .addCase(getCertificatesByUserId.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(getCertificatesByUserId.rejected, (state, action) => {});

    // validate
    builder
      .addCase(validate.pending, (state, action) => {})
      .addCase(validate.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(validate.rejected, (state, action) => {});
  },
});

export default certificateSlice.reducer;
