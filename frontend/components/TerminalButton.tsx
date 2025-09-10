import React from "react";
import { Button } from "@mui/material";

interface TerminalButtonProps {
  text: string;
  onClick?: () => void;
}

const TerminalButton: React.FC<TerminalButtonProps> = ({ text, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      sx={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "#ffffffff",
        textTransform: "none",
        backgroundColor: "transparent",
        borderRadius: 2,
        padding: "6px 14px", // slightly smaller padding
        cursor: "pointer",
        transition: "font-size 0.2s ease",
        fontSize: "1.25rem", // smaller font than TypingText
        "@media (max-width:1200px)": {
          fontSize: "1rem",
        },
        "@media (max-width:600px)": {
          fontSize: "0.65rem",
        },
        "&:hover": {
          backgroundColor: "rgba(199, 199, 199, 0.1)",
        },
        mt: 3, // adds margin-top for space above the button
      }}
    >
      {text}
    </Button>
  );
};

export default TerminalButton;
