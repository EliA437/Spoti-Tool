import React, { type ReactNode } from "react";
import Box from "@mui/material/Box";

interface NavbarBoxProps {
  glowColor: string;
  children: ReactNode;
}

const Navbar: React.FC<NavbarBoxProps> = ({ glowColor, children }) => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "rgba(255,255,255,0.05)",
        width: "50%",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
        borderRadius: "5px",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-25%",
          left: "-25%",
          width: "150%",
          height: "150%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 80%)`,
          filter: "blur(15px)", // softens the glow
          animation: "pulseGlow 6s ease-in-out infinite",
          zIndex: 0,
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
        "@keyframes pulseGlow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Navbar;
