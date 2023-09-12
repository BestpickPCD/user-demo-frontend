import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#fff" : "#211f1f",
      dark: mode === "dark" ? "#ccc" : "#373535",
    },
    // secondary: {
    //   main: mode === "dark" ? "#f2f" : "#f11 ",
    // },
    text: {
      primary: mode === "dark" ? "#fff" : "#211f1f",
      secondary: mode === "dark" ? "#bbb" : "#474646",
    },
    background: {
      default: mode === "dark" ? "#0f0f0f" : "#fff",
    },
    color: {
      text: mode === "dark" ? "#fff" : "#211f1f",
      contrastText: mode === "dark" ? "#211f1f" : "#fff",
    },
  },
});

export const darkModeTheme = createTheme(getDesignTokens("dark"));
export const lightModeTheme = createTheme(getDesignTokens("light"));
