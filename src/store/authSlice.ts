import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
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


export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // GET all auth entries from /auth
    const response = await api.get('/auth');
    const authEntries = response.data; // Array of { email: string, ... } from MockAPI

    // Validate: Check if submitted email matches the allowed one (exact match)
    const allowedEmail = 'symansalman@gmail.com';
    if (credentials.email !== allowedEmail) {
      return rejectWithValue(`Invalid email. Only ${allowedEmail} is allowed to login.`);
    }

    // Optional: Verify email exists in fetched data (for demo realism)
    const userEntry = authEntries.find((entry: any) => entry.email === credentials.email);
    if (!userEntry) {
      return rejectWithValue('Email not found in auth records.');
    }

    // Return mock response (token hardcoded; real API would provide)
    return {
      token: 'mock-jwt-token-123', // Or userEntry.token if your MockAPI has it
      email: credentials.email
    };
  } catch (error) {
  const err = error as AxiosError<{ message?: string }>; // Fix: Type guard
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