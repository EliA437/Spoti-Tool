// components/StyledTextField.tsx
import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
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
    // Trigger fade-in on mount
    const timer = setTimeout(() => setVisible(true), 10); // slight delay to allow transition
    return () => clearTimeout(timer);
  }, []);

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      disabled={disabled}
      autoComplete="off"
      InputLabelProps={{ style: { color: "white" } }}
      InputProps={{ style: { color: "white" } }}
      sx={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-in",
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "white" },
          "&:hover fieldset": { borderColor: "lightgray" },
          "&.Mui-focused fieldset": { borderColor: "white" },
        },
        input: { color: "white" },
        "& .MuiInputBase-input::placeholder": {
          color: "white",
          opacity: 0.6,
        },
        ...sx,
      }}
    />
  );
};

export default StyledTextField;
