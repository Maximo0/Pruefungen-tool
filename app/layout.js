"use client";
/* eslint-disable @next/next/no-head-element */
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function RootLayout({ children }) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
      {/* <ThemeProvider theme={darkTheme}>{children}</ThemeProvider> */}
    </html>
  );
}
