import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  color?: string;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 50,
  color = "white",
}) => {
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typing effect
  useEffect(() => {
    if (index >= text.length) return;
    const timeout = setTimeout(() => setIndex(index + 1), speed);
    return () => clearTimeout(timeout);
  }, [index, text, speed]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Typography
      sx={{
        color,
        fontFamily: "monospace",
        fontWeight: 500,
        whiteSpace: "pre-wrap", 
        wordBreak: "break-word", 
        fontSize: "1.5rem", 
        width: "100%",
        transition: "font-size 0.2s ease",
        "@media (max-width:1200px)": {
          fontSize: "1.25rem",
        },
        "@media (max-width:600px)": {
          fontSize: "0.75rem",
        },
      }}
    >
      {text.substring(0, index)}
      <span style={{ display: "inline-block", width: "0.6ch" }}>
        {showCursor ? "|" : " "}
      </span>
    </Typography>
  );
};

export default TypingText;
