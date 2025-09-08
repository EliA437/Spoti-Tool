import { Textfit } from "react-textfit";
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
    <Textfit
      mode="single"
      max={50} // max font size
      style={{
        color,
        fontFamily: "monospace",
        width: "100%",
        whiteSpace: "pre",
      }}
    >
      {text.substring(0, index)}
      {showCursor && "|"}
    </Textfit>
  );
};

export default TypingText;
