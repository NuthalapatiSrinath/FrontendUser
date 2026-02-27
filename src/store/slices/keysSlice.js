import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

// Fetch my purchased keys
export const fetchMyKeys = createAsyncThunk(
  "keys/fetchMyKeys",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`/user/keys?page=${page}&limit=${limit}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load keys"
      );
    }
  }
);

// Fetch available keys grouped by game
export const fetchAvailableKeys = createAsyncThunk(
  "keys/fetchAvailableKeys",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/keys/available");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load available keys"
      );
    }
  }
);

// Generate (purchase) a key
export const generateKey = createAsyncThunk(
  "keys/generateKey",
  async ({ game, duration }, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/keys/generate", { game, duration });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate key"
      );
    }
  }
);

// Delete a key
export const deleteKey = createAsyncThunk(
  "keys/deleteKey",
  async (keyId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/user/keys/${keyId}`);
      return { keyId, ...res.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete key"
      );
    }
  }
);

const keysSlice = createSlice({
  name: "keys",
  initialState: {
    myKeys: [],
    availableKeys: [],
    pagination: null,
    isLoading: false,
    generateLoading: false,
    error: null,
    lastGenerated: null,
  },
  reducers: {
    clearKeysError: (state) => {
      state.error = null;
    },
    clearLastGenerated: (state) => {
      state.lastGenerated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // My keys
      .addCase(fetchMyKeys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyKeys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myKeys = action.payload.keys;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Available keys
      .addCase(fetchAvailableKeys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableKeys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableKeys = action.payload.availableKeys;
      })
      .addCase(fetchAvailableKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate key
      .addCase(generateKey.pending, (state) => {
        state.generateLoading = true;
      })
      .addCase(generateKey.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.lastGenerated = action.payload;
      })
      .addCase(generateKey.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.payload;
      })
      // Delete key
      .addCase(deleteKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteKey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myKeys = state.myKeys.filter(key => key._id !== action.payload.keyId);
      })
      .addCase(deleteKey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearKeysError, clearLastGenerated } = keysSlice.actions;
export default keysSlice.reducer;

// Export alias for compatibility
export const getKeys = fetchMyKeys;
