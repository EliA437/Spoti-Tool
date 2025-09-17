import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";

interface CreatePlaylistProps {
  onBack: () => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState("");
  const [numSongs, setNumSongs] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCreatePlaylist = async (
    overridePrompt?: string,
    overrideNumSongs?: number
  ) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/playlist-generator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: overridePrompt ?? prompt,
            num_songs: overrideNumSongs ?? numSongs,
          }),
        }
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
            placeholder="Enter a number less than 50"
            value={numSongs}
            onChange={(e) => setNumSongs(e.target.value)}
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
              input: { color: "white" },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
                opacity: 0.6,
              },
            }}
          />

          {/* Normal create */}
          <TerminalButton
            text={loading ? "Creating..." : "Create Playlist"}
            onClick={() => handleCreatePlaylist()}
            isDisabled={
              prompt.trim() === "" || 
              numSongs.trim() === "" || 
              isNaN(Number(numSongs)) || 
              Number(numSongs) <= 0 
            }
          />
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
