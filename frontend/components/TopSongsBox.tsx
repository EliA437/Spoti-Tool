import React from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";

interface WhiteScrollListProps {
  items: string[];
}

const WhiteScrollList: React.FC<WhiteScrollListProps> = ({ items }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        px: 2,
        // Custom white scrollbar
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "white",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      <List>
        {(items || []).map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={item}
              primaryTypographyProps={{
                sx: { color: "white", fontFamily: "monospace" },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WhiteScrollList;
