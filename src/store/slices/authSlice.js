import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import toast from "react-hot-toast";

// --- Async Thunk for User Login ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/auth/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

// --- Async Thunk for User Registration ---
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password, referralCode }, { rejectWithValue }) => {
    try {
      const payload = { username, email, password };
      if (referralCode) {
        payload.referralCode = referralCode;
      }
      const response = await api.post("/user/auth/register", payload);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return rejectWithValue(message);
    }
  },
);

// --- Initial State ---
const userData = localStorage.getItem("user_data")
  ? JSON.parse(localStorage.getItem("user_data"))
  : null;
const token = localStorage.getItem("user_token");

const initialState = {
  user: userData,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
  isRegistered: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_token");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegistered: (state) => {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user_data", JSON.stringify(action.payload.user));
        localStorage.setItem("user_token", action.payload.token);

        toast.success(`Welcome back, ${action.payload.user.username}`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRegistered = true;
        toast.success("Registration successful! Please login.");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, clearError, clearRegistered } = authSlice.actions;
export default authSlice.reducer;
