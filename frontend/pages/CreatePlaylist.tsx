import React from "react";
import { Box } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";

interface CreatePlaylistProps {
  onBack: () => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({ onBack }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // takes full height of parent
      }}
    >
      {/* Main content at the top */}
      <Box sx={{ flexGrow: 1 }}>
        <TypingText text={`Let's create a new playlist!`} speed={15} />
      </Box>

      {/* Go Back button anchored bottom-right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default CreatePlaylist;

