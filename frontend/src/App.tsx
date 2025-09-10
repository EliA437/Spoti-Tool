import { Box } from "@mui/material";
import TerminalBox from "../components/TerminalBox";
import TypingText from "../components/TypingText";
import TerminalButton from "../components/TerminalButton";
import React, { useState } from "react";

function App() {
  // Track which step of the UI we are in
  const [step, setStep] = useState<"welcome" | "options">("welcome");

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
        {step === "welcome" && (
          <>
            <TypingText
              text={`Welcome to the Spotify Playlist Manager!`}
              speed={15}
            />
            <TerminalButton
              text="Click here to get started"
              onClick={() => setStep("options")}
            />
          </>
        )}

        {step === "options" && (
          <>
            <TypingText text={`What would you like to do?`} speed={15} />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                justifyContent: "center", // centers the buttons horizontally
                alignItems: "center", // centers them vertically (optional)
                flexWrap: "wrap", // wraps buttons on smaller screens
              }}
            >
              <TerminalButton
                text="Create Playlist"
                onClick={() => console.log("Create Playlist clicked")}
              />
              <TerminalButton
                text="Edit Playlist"
                onClick={() => console.log("Edit Playlist clicked")}
              />
              <TerminalButton
                text="View Playlist"
                onClick={() => console.log("View Playlist clicked")}
              />
            </Box>
          </>
        )}
      </TerminalBox>
    </Box>
  );
}

export default App;
