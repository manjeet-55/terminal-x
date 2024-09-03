import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: "toast",
  initialState: {
    title: "",
    message: "",
    variant: "info",
    open: false,
  },
  reducers: {
    showToast: (state, action) => {
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.variant = action.payload.variant;
      state.open = true;
    },
    hideToast: (state) => {
      state.open = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
