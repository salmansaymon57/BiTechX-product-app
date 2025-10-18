// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming you'll use Axios for API calls
import { AxiosError } from 'axios'; // Add AxiosError import

// Define types
export interface AuthState {
  token: string | null;
  userEmail: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
}

interface AuthResponse {
  token: string;
  email: string; // Assuming API returns email back
}

// Async thunk for login
export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth', credentials); // Replace with your API base URL
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>; // Type guard to avoid 'any'
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

const initialState: AuthState = {
  token: null,
  userEmail: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.userEmail = action.payload; // Placeholder; update based on API
    },
    logout: (state) => {
      state.token = null;
      state.userEmail = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userEmail = action.payload.email;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;