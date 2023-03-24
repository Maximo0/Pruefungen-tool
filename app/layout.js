"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import './global.css'
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Scheint noch nicht ganz zu funktionieren
export const metadata = {
  title: 'Prüfungen',
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#80A1C1",
    },
    secondary: {
      main: "#424B54",
    },
    background: {
      default: "#D9CFC1",
    },
  },
});

export default function RootLayout({ children, title }) {
  return (
    <html>
      <head>
        <title>Prüfungen</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
