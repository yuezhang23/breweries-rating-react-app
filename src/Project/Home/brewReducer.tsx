import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentBrews: [],
}


const brewSlice = createSlice({
  name: "breweries",
  initialState,
  reducers: {
    setBrews(state, action) {
      state.currentBrews = action.payload;
    }
  },
});

export const { setBrews } = brewSlice.actions;
export default brewSlice.reducer;