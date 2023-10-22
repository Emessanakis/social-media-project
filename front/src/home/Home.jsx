import React from "react";
import Topbar from "../topbar/Topbar";
import Stories from "../stories/Stories"
import "./home.scss"
import { Box } from "@mui/material";
function Home() {
    return (
        <React.Fragment>
            <Box  sx={{
            bgcolor: 'background.default',
            color: 'text.primary'
          }}>
            <Topbar />
            <div className="the-stories-container">
                <Stories />
            </div>
            </Box>
            
            
        </React.Fragment>
    );
}

export default Home;
