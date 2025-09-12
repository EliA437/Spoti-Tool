import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";
import WhiteScrollList from "../components/WhiteScrollList";

interface TopArtistsProps {
  onBack: () => void;
}

const TopArtists: React.FC<TopArtistsProps> = ({ onBack }) => {
  const [artists, setArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopArtists = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/top-artists"); 
      const data = await res.json();
      setArtists(data.artists || data || []);
    } catch (err) {
      console.error("Failed to fetch top artists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopArtists(); 
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flexGrow: 0 }}>
        <TypingText
          key={loading ? "loading" : "loaded"} 
          text={loading ? "Fetching top artists..." : "Here are your top artists!"}
          speed={15}
        />
      </Box>

      <WhiteScrollList items={artists} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default TopArtists;



