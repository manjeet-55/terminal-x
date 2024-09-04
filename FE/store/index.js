import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "./slices/toastSlice";
import processSlice from "./slices/processSlice";
const store = configureStore({
  reducer: {
    toast: toastSlice,
    process:processSlice  
  },
});
export default store;