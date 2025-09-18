import React, { useState, useEffect } from "react";
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

      if (!response.ok) throw new Error("Failed"); // Treat any non-2xx as failure

      const data = await response.json();
      setResult(
        data.message
          ? "Playlist created successfully!"
          : "Failed to create playlist"
      );
    } catch {
      setResult("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result === "Playlist created successfully!") {
      const timer = setTimeout(() => {
        setResult(null);
        setPrompt("");
        setNumSongs("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const statusText = loading
    ? "Creating playlist..."
    : result
    ? result
    : "Let's create a new playlist!";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Status TypingText */}
        <TypingText text={statusText} speed={15} />

        {/* Form */}
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Playlist prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
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
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "lightgray" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              input: { color: "white" },
              "& .MuiInputBase-input::placeholder": { color: "white", opacity: 0.6 },
            }}
          />

          <TerminalButton
            text={loading ? "..." : "Create Playlist"}
            onClick={() => handleCreatePlaylist()}
            isDisabled={
              loading || 
              prompt.trim() === "" ||
              numSongs.trim() === "" ||
              isNaN(Number(numSongs)) ||
              Number(numSongs) <= 0
            }
          />
        </Box>
      </Box>

      {/* Go Back Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default CreatePlaylist;

