import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase.client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  sessionTimeout: number | null;
}

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  sessionTimeout: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
      
      // Set session timeout when user logs in
      if (action.payload) {
        state.sessionTimeout = Date.now() + SESSION_TIMEOUT;
      } else {
        state.sessionTimeout = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.sessionTimeout = null;
      // Sign out from Supabase
      void supabase.auth.signOut();
    },
    checkSession: (state) => {
      if (state.sessionTimeout && Date.now() > state.sessionTimeout) {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionTimeout = null;
        // Sign out from Supabase
        void supabase.auth.signOut();
      }
    },
  },
});

export const { setUser, setLoading, setError, logout, checkSession } = authSlice.actions;
export default authSlice.reducer;