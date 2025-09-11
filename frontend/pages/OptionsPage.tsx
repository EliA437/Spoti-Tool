import React from "react";
import { Box } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";

interface OptionsPageProps {
  onSelectSongs: () => void;
  onSelectArtists: () => void;
  onCreatePlaylist: () => void;
  onBack: () => void;
}

const OptionsPage: React.FC<OptionsPageProps> = ({
  onSelectSongs,
  onSelectArtists,
  onCreatePlaylist,
  onBack,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "flex-start", // keep content at the top
        alignItems: "center",
        pt: 2, // some padding from the top
      }}
    >
      {/* Text at the top */}
      <TypingText text={`What would you like to do?`} speed={15} />

      {/* Buttons vertically below the text */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 4, // space between text and buttons
        }}
      >
        <TerminalButton text="Get Top Songs" onClick={onSelectSongs} />
        <TerminalButton text="Get Top Artists" onClick={onSelectArtists} />
        <TerminalButton text="Create Playlist" onClick={onCreatePlaylist} />
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default OptionsPage;

