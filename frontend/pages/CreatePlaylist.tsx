import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";

interface CreatePlaylistProps {
  onBack: () => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState("");
  const [numSongs, setNumSongs] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCreatePlaylist = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/playlist-generator?prompt=${encodeURIComponent(
          prompt
        )}&num_songs=${numSongs}`
      );
      const data = await response.json();
      setResult(data.message);
    } catch (err) {
      console.error(err);
      setResult("Error creating playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <TypingText text={`Let's create a new playlist!`} speed={15} />

        {/* Simple form */}
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Playlist prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "lightgray" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
          />
          <TextField
            label="Number of songs"
            type="number"
            value={numSongs}
            onChange={(e) => setNumSongs(Number(e.target.value))}
            fullWidth
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "lightgray" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
          />
          <TerminalButton text="Create Playlist" onClick={handleCreatePlaylist} />
        </Box>

        {/* Result display */}
        {result && <Box sx={{ mt: 2 }}>{result}</Box>}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default CreatePlaylist;

