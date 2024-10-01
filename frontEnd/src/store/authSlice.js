import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  role: "user", // Add role to the state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.role = action.payload.role; // Assume role is part of the payload
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.role = null; // Reset role on logout
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
