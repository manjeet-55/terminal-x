import { createSlice } from "@reduxjs/toolkit";

export const processSlice = createSlice({
  name: "process",
  initialState: {
    processes:[]
  },
  reducers: {
    addProcesses: (state, action) => {
      console.log("action",action.payload)
      state.processes = action.payload;
    },
  },
});

export const { addProcesses } = processSlice.actions;

export default processSlice.reducer;
