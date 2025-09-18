// pages/CreatePlaylist.tsx
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";
import StyledTextField from "../components/FormInput";

interface CreatePlaylistProps {
  onBack: () => void;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState("");
  const [numSongs, setNumSongs] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [statusLines, setStatusLines] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleCreatePlaylist = async () => {
    setLoading(true);
    setStatusLines([]);
    setResult(null);

    try {
      const es = new EventSource(
        "http://localhost:8000/api/playlist-generator/stream"
      );
      eventSourceRef.current = es;

      es.onopen = () => {
        setStatusLines(["Connection established..."]);
      };

      es.onmessage = (event) => {
        if (event.data === "heartbeat") return;

        if (event.data === "COMPLETED") {
          setResult("Playlist created successfully!");
          setStatusLines([]);
          setLoading(false);
          es.close();
          return;
        }

        if (event.data === "FAILED" || event.data.startsWith("ERROR:")) {
          setResult("Failed to create playlist");
          setStatusLines([]);
          setLoading(false);
          es.close();
          return;
        }
        setStatusLines([event.data]);
      };

      es.onerror = () => {
        setStatusLines(["Connection error occurred"]);
        setLoading(false);
        es.close();
      };

      setTimeout(async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/playlist-generator",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt, num_songs: Number(numSongs) }),
            }
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          console.log("Playlist generation started:", data);
        } catch (error) {
          console.error("Error starting playlist generation:", error);
          setResult("Failed to start playlist generation");
          setStatusLines([]);
          setLoading(false);
          if (eventSourceRef.current) eventSourceRef.current.close();
        }
      }, 100);
    } catch {
      setResult("Failed to start playlist generation");
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (result === "Playlist created successfully!") {
      const timer = setTimeout(() => {
        setResult(null);
        setPrompt("");
        setNumSongs("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const statusText = loading
    ? "Creating playlist..."
    : result
    ? result
    : "Let's create a new playlist!";

  const isFormDisabled =
    loading ||
    prompt.trim() === "" ||
    numSongs.trim() === "" ||
    isNaN(Number(numSongs)) ||
    Number(numSongs) <= 0 ||
    Number(numSongs) > 50;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        position: "relative",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <TypingText text={statusText} speed={15} />

        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <StyledTextField
            label="Playlist prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {prompt.trim() !== "" && (
            <StyledTextField
              label="Number of songs"
              placeholder="Enter a number (1-50)"
              value={numSongs}
              onChange={(e) => setNumSongs(e.target.value)}
            />
          )}

          {!isFormDisabled && (
            <TerminalButton
              text={loading ? " " : "Create Playlist"}
              onClick={handleCreatePlaylist}
            />
          )}
        </Box>
      </Box>

      {statusLines.length > 0 && (
        <Box sx={{ mt: 2, minHeight: "12px" }}>
          {statusLines.map((line, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <TypingText text={line} speed={30} />
            </Box>
          ))}
        </Box>
      )}

      {/* Go Back button */}
      <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
        <TerminalButton text="Go Back" onClick={onBack} isDisabled={loading} />
      </Box>
    </Box>
  );
};

export default CreatePlaylist;
