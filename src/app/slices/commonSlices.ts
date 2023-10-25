import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  lang: string;
  theme: "dark" | "light" | "";
  isSubmitTransaction: boolean;
}

const initialState: CounterState = {
  lang: "",
  theme: "",
  isSubmitTransaction: false,
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
    isSubmitTransaction: (state, action) => ({
      ...state,
      isSubmitTransaction: action.payload,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { getTheme, getLang, isSubmitTransaction } = commonSlice.actions;

export default commonSlice.reducer;
