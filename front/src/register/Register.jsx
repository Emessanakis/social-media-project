import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";


export default function Register() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        profilePicture: null, // Added for profile picture
    });

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setFormData({ ...formData, profilePicture: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleCloseDialog = () => {
        setRegistrationSuccess(false);
    };

    const handleRegistration = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("name", formData.name);
            formDataToSend.append("profilePicture", formData.profilePicture);

            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                // Registration successful, open the dialog
                setRegistrationSuccess(true);
            } else {
                // Handle registration error
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };



    return (
        <React.Fragment>
            <Box>
                <div className="login-wrapper">
                    <form className="login-container">
                        <div className="login-form">
                            <h3>Register Form</h3>
                            <TextField
                                className="textfields"
                                required
                                label="Username"
                                variant="standard"
                                type="text"
                                name="username"
                                onChange={handleInputChange}
                            />
                            <TextField
                                className="textfields"
                                required
                                label="Password"
                                variant="standard"
                                type="password"
                                name="password"
                                onChange={handleInputChange}
                            />
                            <TextField
                                className="textfields"
                                required
                                label="Full-Name"
                                variant="standard"
                                type="text"
                                name="name"
                                onChange={handleInputChange}
                            />

                            <input
                                accept="image/*"
                                name="profilePicture"
                                style={{ display: "none" }}
                                id="image-upload-input"
                                type="file"
                                onChange={handleInputChange}
                            />
                            <label htmlFor="image-upload-input" className="image-upload-label">
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="span"
                                >
                                    <PhotoCamera />
                                </IconButton>
                                <span className="icon-title">Upload Image</span> {/* Icon title */}
                            </label>
                            <div className="button-wrapper">
                                <Button
                                    type="button"
                                    variant="contained"
                                    sx={{ bgcolor: "text.primary", color: "light", width: '100%' }}
                                    onClick={handleRegistration}
                                >
                                    Register
                                </Button>
                            </div>
                            <div className="reg-text">
                                <p>Already a member?</p>
                                <Link to={'/'}>
                                    <Button type="button" sx={{ textTransform: 'none' }}>
                                        <p>Login now</p>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </Box>
            <Dialog open={registrationSuccess} onClose={handleCloseDialog}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    <p>Your registration was successful. You can now login using your new account.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}