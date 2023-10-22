import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import "./login.scss";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../actions";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'


export default function Login() {
    Axios.defaults.withCredentials = true;

    const [usernameLog, setUsernameLog] = useState("");
    const [passwordLog, setPasswordLog] = useState("");

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = () => {
        Axios.post('http://localhost:8080/login', {
            username: usernameLog,
            password: passwordLog,
        }).then((response) => {
            if (response.data.message) {
                dispatch(loginFailure(response.data.message));
            } else if (response.data[0].username) {
                dispatch(loginSuccess(response.data[0]));
                navigate('/Home');
            }
        });

    };

    const error = useSelector((state) => state.auth.error);

    if (isLoggedIn) {
        return null;
    }
    else {
        return (
            <React.Fragment>
                <Box>
                    <div className="login-wrapper">
                        <form className="login-container">
                            <div className="login-form">
                                <h3>Login Form</h3>
                                <TextField
                                    className="textfields"
                                    required
                                    label="Username"
                                    variant="standard"
                                    type="text"
                                    name="username"
                                    onChange={(e) => {
                                        setUsernameLog(e.target.value);
                                        dispatch(loginFailure(null)); // Clear error using Redux action
                                    }}
                                />
                                <TextField
                                    className="textfields"
                                    required
                                    label="Password"
                                    variant="standard"
                                    type="password"
                                    name="password"
                                    onChange={(e) => {
                                        setPasswordLog(e.target.value);
                                        dispatch(loginFailure(null)); // Clear error using Redux action
                                    }}
                                />
                                <div className="button-wrapper">
                                    <Button
                                        onClick={login}
                                        type="button"
                                        variant="contained"
                                        sx={{ bgcolor: "text.primary", color: "light", width: '100%' }}
                                    >
                                        Login
                                    </Button>

                                </div>
                                <div className="reg-text"><p>Not a member?</p>
                                <Link to={'/Register'} >
                                    <Button
                                        type="button"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        <p>Sign up now</p>
                                    </Button>
                                    </Link>
                                </div>

                                {error && (
                                    <Typography variant="body2" color="error">
                                        {error}
                                    </Typography>
                                )}
                            </div>
                        </form>
                    </div>
                </Box>
            </React.Fragment>
        );
    }
}