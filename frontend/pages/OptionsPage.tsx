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
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <TypingText text={`What would you like to do?`} speed={15} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 4,
            marginTop: 12,
          }}
        >
          <TerminalButton text="Get Top Songs" onClick={onSelectSongs} />
          <TerminalButton text="Get Top Artists" onClick={onSelectArtists} />
          <TerminalButton text="Create Playlist" onClick={onCreatePlaylist} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default OptionsPage;




