import { Box } from "@mui/material";
import TerminalBox from "../components/TerminalBox";
import TypingText from "../components/TypingText";

function App() {
  return (
    <Box
      sx={{
        bgcolor: "#121212",
        backgroundImage: "url('/mountains.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        p: 2,
      }}
    >
      <TerminalBox>
        <TypingText
          text="Welcome to the Spotify Playlist Manager..."
          speed={50}
        />
      </TerminalBox>
    </Box>
  );
}

export default App;
