import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/inter";
import { CssBaseline, CssVarsProvider, extendTheme } from "@mui/joy";

const theme = extendTheme({
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.color === "magenta" && {
            color: "#fff",
            backgroundColor: "#F733BF",
            "&:active": {
              backgroundColor: "#c51593",
            },
          }),
          ...(ownerState.color === "yellow" && {
            color: "#000",
            backgroundColor: "#FFC400",
            "&:active": {
              backgroundColor: "#d4a000",
            },
          }),
          ...(ownerState.color === "pink" && {
            color: "#fff",
            backgroundColor: "#FF2D55",
            "&:active": {
              backgroundColor: "#cc2047",
            },
          }),
          ...(ownerState.color === "orange" && {
            color: "#fff",
            backgroundColor: "#FF9500",
            "&:active": {
              backgroundColor: "#cc7a00",
            },
          }),
          ...(ownerState.color === "secondary" && {
            color: theme.vars.palette.text.secondary,
            backgroundColor: theme.vars.palette.background.level1,
            "&:active": {
              backgroundColor: theme.vars.palette.background.level2,
            },
          }),
          ...(ownerState.color === "turquoise" && {
            color: "#fff",
            backgroundColor: "#00C8C8",
            "&:active": {
              backgroundColor: "#00a0a0",
            },
          }),
        }),
      },
    },
  },
});

declare module "@mui/joy/Button" {
  interface ButtonPropsColorOverrides {
    magenta: true;
    yellow: true;
    pink: true;
    orange: true;
    secondary: true;
    turquoise: true;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>,
);
