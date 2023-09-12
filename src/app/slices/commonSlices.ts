import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  lang: string;
  theme: "dark" | "light" | "";
}

const initialState: CounterState = {
  lang: "",
  theme: "",
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    getTheme: (state, action) => ({
      ...state,
      theme: action.payload,
    }),
    getLang: (state, action) => ({
      ...state,
      lang: action.payload,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { getTheme, getLang } = commonSlice.actions;

export default commonSlice.reducer;
