"use client";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function Loading() {
  return (
    <Box sx={{ height: "100vh" ,display: 'flex', justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}
