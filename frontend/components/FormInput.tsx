import React, { useEffect, useState } from "react";
import { TextField, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface StyledTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const StyledTextField: React.FC<StyledTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  fullWidth = true,
  disabled = false,
  sx = {},
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        borderRadius: "5px",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "5px",
          boxShadow: "0 0 6px 1px rgba(255,255,255,0.4)", 
          opacity: 0.4,
          animation: "pulseGlow 2s infinite alternate",
          pointerEvents: "none",
          zIndex: 0,
        },
        "@keyframes pulseGlow": {
          "0%": { boxShadow: "0 0 3px 0.5px rgba(255,255,255,0.2)" },
          "50%": { boxShadow: "0 0 8px 1px rgba(255,255,255,0.4)" },
          "100%": { boxShadow: "0 0 4px 0.8px rgba(255,255,255,0.3)" },
        },
      }}
    >
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth={fullWidth}
        disabled={disabled}
        autoComplete="off"
        InputLabelProps={{ style: { color: "white", zIndex: 1 } }}
        InputProps={{ style: { color: "white", zIndex: 1 } }}
        sx={{
          position: "relative",
          backgroundColor: "transparent",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease-in",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white", zIndex: 1 },
            "&:hover fieldset": { borderColor: "lightgray" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
          input: { color: "white", zIndex: 1 },
          "& .MuiInputBase-input::placeholder": {
            color: "white",
            opacity: 0.6,
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default StyledTextField;
