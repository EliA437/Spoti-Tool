import React, { type ReactNode } from "react";
import { Box } from "@mui/material";

interface TerminalBoxProps {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
}

const TerminalBox: React.FC<TerminalBoxProps> = ({
  children,
  width = "60%",
  height = "85%",
}) => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.05)",
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 0 8px rgba(255,255,255,0.2)",
        backdropFilter: "blur(70px)",
        WebkitBackdropFilter: "blur(20px)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        width,
        height,
      }}
    >
      {children}
    </Box>
  );
};

export default TerminalBox;
