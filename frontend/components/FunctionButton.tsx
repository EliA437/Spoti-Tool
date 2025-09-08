import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface CatButtonProps {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
}

const CatButton: React.FC<CatButtonProps> = ({ text, onClick, isDisabled }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);
  };

  return (
    <Button
      variant="contained"
      sx={{
        color: "white",
        height: "40px",
        flex: 1,
        padding: 0,
        backgroundColor: "rgba(149, 149, 149, 0.21)", 
        "&:hover": {
          backgroundColor: "#747474ff", 
        },
      }}
      onClick={handleClick}
      disabled={isDisabled}
    >
      <Typography
        sx={{
          fontSize: "0.8rem",
          width: "100%",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </Typography>
    </Button>
  );
};

export default CatButton;
