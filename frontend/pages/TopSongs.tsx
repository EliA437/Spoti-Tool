import React, { useEffect, useState } from "react";
import { Box, Button, List, ListItem, ListItemText } from "@mui/material";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";
import TopSongsBox from "../components/TopSongsBox";

interface TopSongsProps {
  onBack: () => void;
}

const TopSongs: React.FC<TopSongsProps> = ({ onBack }) => {
  const [tracks, setTracks] = useState<string[]>([]);

  const fetchTopTracks = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/top-tracks");
      const data = await res.json();
      setTracks(data.tracks || data || []);
    } catch (err) {
      console.error("Failed to fetch top tracks:", err);
    }
  };

  useEffect(() => {
    fetchTopTracks();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ flexGrow: 0 }}>
        <TypingText text={`Here are your top songs!`} speed={15} />
      </Box>

      <TopSongsBox items={tracks}/>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <TerminalButton text="Go Back" onClick={onBack} />
      </Box>
    </Box>
  );
};

export default TopSongs;
