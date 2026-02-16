"use client";
import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#004A59" },
    secondary: { main: "#CBF200" },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
});

export default function MuiRootProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
