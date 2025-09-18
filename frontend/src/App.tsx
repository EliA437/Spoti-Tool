import { Box, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image"; 
import TerminalBox from "../components/TerminalBox";
import TopSongs from "../pages/TopSongs";
import TopArtists from "../pages/TopArtists";
import CreatePlaylist from "../pages/CreatePlaylist";
import Home from "../pages/Home";
import OptionsPage from "../pages/OptionsPage";
import { useState } from "react";

function App() {
  const [step, setStep] = useState<
    "welcome" | "options" | "songs" | "artists" | "create"
  >("welcome");

  const [backgroundImage, setBackgroundImage] = useState<string>("/mountains.jpg");

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setBackgroundImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative", // needed for the icon button positioning
      }}
    >
      <TerminalBox>
        {step === "welcome" && <Home onStart={() => setStep("options")} />}
        {step === "options" && (
          <OptionsPage
            onSelectSongs={() => setStep("songs")}
            onSelectArtists={() => setStep("artists")}
            onCreatePlaylist={() => setStep("create")}
            onBack={() => setStep("welcome")}
          />
        )}
        {step === "songs" && <TopSongs onBack={() => setStep("options")} />}
        {step === "artists" && <TopArtists onBack={() => setStep("options")} />}
        {step === "create" && <CreatePlaylist onBack={() => setStep("options")} />}
      </TerminalBox>

      {/* Bottom-right icon button to change background, only on Home */}
      {step === "welcome" && (
        <Box
          sx={{
            position: "absolute",
            bottom: 24, // space from bottom
            right: 24,  // space from right
          }}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="background-upload"
            type="file"
            onChange={handleBackgroundChange}
          />
          <label htmlFor="background-upload">
            <IconButton
              color="primary"
              component="span"
              sx={{
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                width: 48,
                height: 48,
              }}
            >
              <ImageIcon sx={{ color: "white", fontSize: 28 }} />
            </IconButton>
          </label>
        </Box>
      )}
    </Box>
  );
}

export default App;
