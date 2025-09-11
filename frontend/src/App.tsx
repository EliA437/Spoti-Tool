import { Box } from "@mui/material";
import TerminalBox from "../components/TerminalBox";
import TopSongs from "../pages/TopSongs";
import TopArtists from "../pages/TopArtists";
import CreatePlaylist from "../pages/CreatePlaylist";
import Home from "../pages/Home";
import OptionsPage from "../pages/OptionsPage"; // <-- import OptionsPage
import { useState } from "react";

function App() {
  const [step, setStep] = useState<
    "welcome" | "options" | "songs" | "artists" | "create"
  >("welcome");

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
        p: 2,
      }}
    >
      <TerminalBox>
        {/* Home Page */}
        {step === "welcome" && <Home onStart={() => setStep("options")} />}

        {/* Options Page */}
        {step === "options" && (
          <OptionsPage
            onSelectSongs={() => setStep("songs")}
            onSelectArtists={() => setStep("artists")}
            onCreatePlaylist={() => setStep("create")}
            onBack={() => setStep("welcome")}
          />
        )}

        {/* Other Pages */}
        {step === "songs" && <TopSongs onBack={() => setStep("options")} />}
        {step === "artists" && <TopArtists onBack={() => setStep("options")} />}
        {step === "create" && <CreatePlaylist onBack={() => setStep("options")} />}
      </TerminalBox>
    </Box>
  );
}

export default App;


