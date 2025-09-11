import React from "react";
import { Box } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";

interface TopArtistsProps {
  onBack: () => void;
}

const TopArtists: React.FC<TopArtistsProps> = ({ onBack }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", 
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <TypingText text={`Here are your top artists!`} speed={15} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2, 
        }}
      >
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default TopArtists;


