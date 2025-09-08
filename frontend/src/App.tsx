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
          text="Welcome to the Spotify Playlist Manager! Here you can create, edit, and organize your playlists with ease. Explore new music, discover trending tracks, and manage your favorite songs all in one place. Enjoy a seamless, interactive experience as your playlists come to life with every keystroke. 

                Press Enter to get started."
          speed={15}
        />
      </TerminalBox>
    </Box>
  );
}

export default App;
