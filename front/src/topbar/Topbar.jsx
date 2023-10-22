import React, { useState,  useContext, useEffect  } from "react";
import "./topbar.scss";
import { Link } from "react-router-dom";
import { ColorModeContext } from '../colormode/colorMode';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, } from "@mui/material";
import Axios from 'axios';
import ManageFriends from "../manage-friends/ManageFriends";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginSuccess, logoutSucceed } from "../actions"

function Topbar() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toggleMode } = useContext(ColorModeContext);
    const [isManageFriendsDialogOpen, setManageFriendsDialogOpen] = useState(false);

    const [userName, setUserName] = useState(""); 
    const [userIcon, setUserIcon] = useState(""); 

    useEffect(() => {
        Axios.get('http://localhost:8080/profile', { withCredentials: true })
            .then((response) => {
                if (response.data && response.data.userData.length > 0) {
                    setUserName(response.data.userData[0].name);
                    setUserIcon(response.data.userData[0].icon);
                    dispatch(loginSuccess(response.data.userData[0])); 
                }
            })
            .catch((error) => {
                console.error("Failed to fetch user data:", error);
            });
    }, [dispatch]);

    const openManageFriendsDialog = () => {
        setManageFriendsDialogOpen(true);
    };

    const closeManageFriendsDialog = () => {
        setManageFriendsDialogOpen(false);
    };
    const handleLogout = () => {
        Axios.post('http://localhost:8080/logout', { withCredentials: true })
            .then((response) => {
                if (response.data.message === "Logout successful") {
                    dispatch(logoutSucceed()); 
                    navigate('/');
                }
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };
    
    return (
        <React.Fragment>
            <Box sx={{
                bgcolor: 'background.default',
                color: 'text.primary'
            }}
            >
                <div className="top-container">
                    <nav className="left">
                        <ul className="li-container">
                            <Link to="/Home" style={{ color: 'text.primary', textDecoration: 'none', textTransform: 'capitalize' }}>
                                <Button sx={{ color: 'text.primary', fontSize: "15px", cursor: "pointer", textTransform: 'capitalize' }} >
                                    <li className="user-img">
                                        {userIcon && (
                                            <img src={require(`../img/${userIcon}`)} alt="" />
                                        )}
                                    </li>
                                    <li className="items">
                                        <p style={{ color: 'inherit' }}>{userName}</p>
                                    </li>
                                </Button>
                            </Link>
                        </ul>
                    </nav>
                    <div className="right">
                        <ul className="li-container">
                                <Button sx={{ color: 'text.primary', fontSize: "15px", cursor: "pointer", textTransform: 'capitalize' }} id="manage-friends" onClick={openManageFriendsDialog}>
                                    <li className="items" title="Manage-Friends">
                                        <div className="mui-icon">
                                            <GroupRoundedIcon />
                                        </div>
                                        <p className="mui-names">Manage Friends</p>
                                    </li>
                                </Button>
                            <Button sx={{ color: 'text.primary', fontSize: "15px", cursor: "pointer", textTransform: 'capitalize' }}>
                                <li className="items" title="Dark Mode" onClick={toggleMode}>
                                    <div className="mui-icon">
                                        <SettingsBrightnessRoundedIcon />
                                    </div>
                                    <p className="mui-names">Dark Mode</p>
                                </li>
                            </Button>
                            <Button sx={{ color: 'text.primary', fontSize: "15px", cursor: "pointer", textTransform: 'capitalize' }} onClick={handleLogout}>
                                <li className="items" title="Logout">
                                    <div className="mui-icon">
                                        <ExitToAppRoundedIcon />
                                    </div>
                                    <p className="mui-names">Logout</p>
                                </li>
                            </Button>
                        </ul>
                    </div>
                </div>
            </Box>
            {/* Manage Friends Dialog */}
            <Dialog
                open={isManageFriendsDialogOpen}
                onClose={closeManageFriendsDialog}
                aria-labelledby="manage-friends-dialog"
            >
                <DialogTitle>Manage Your Friends Here</DialogTitle>
                <DialogContent>
                <ManageFriends/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeManageFriendsDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Topbar;
