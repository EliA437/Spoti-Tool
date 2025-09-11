import React from "react";
import { Box } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        px: 2,
      }}
    >
      {/* Text at the top */}
      <Box sx={{ flexGrow: 0, mt: 2 }}>
        <TypingText text={`Welcome to the Spotify Playlist Manager!`} speed={15} />
      </Box>

      {/* Spacer to push the button to the middle */}
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <TerminalButton text="Click here to get started" onClick={onStart} />
      </Box>
    </Box>
  );
};

export default HomePage;

