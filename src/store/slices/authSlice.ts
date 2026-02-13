import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

const initialState: AuthState = {
  user: null,
  token: "",
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || "Registration failed",
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message || "Login failed");
      }
      return rejectWithValue("An unknown error occurred");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("authState");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("authState", JSON.stringify(state));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("authState", JSON.stringify(state));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
