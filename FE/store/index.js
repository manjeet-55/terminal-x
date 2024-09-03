import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "./slices/toastSlice";
const store = configureStore({
  reducer: {
    toast: toastSlice,
  },
});
export default store;