import React, { useState, useEffect } from 'react';
import './manageFriends.scss';
import Axios from 'axios';
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function ManageFriends() {
    const [friends, setFriends] = useState([]);
    const [users, setallUsers] = useState([]);

    // fetch friends data
    useEffect(() => {
        Axios.get('http://localhost:8080/friends', { withCredentials: true })
            .then((response) => {
                if (response.data) {
                    setFriends(response.data);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch friends data:", error);
            });
    }, []);

    // fetch new friends data
    useEffect(() => {
        Axios.get('http://localhost:8080/new-friends', { withCredentials: true })
            .then((response) => {
                if (response.data) {
                    setallUsers(response.data.users);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch new friends data:", error);
            });
    }, []);

    const deleteFriend = (friendId) => {
        //delete the friend with friendId
        Axios.delete(`http://localhost:8080/delete-friend/${friendId}`, { withCredentials: true })
            .then((response) => {
                // Update the friends list on successful deletion
                if (response.data.success) {
                    const updatedFriends = friends.filter(friend => friend.user_id !== friendId);
                    setFriends(updatedFriends);
    
                    // Fetch and log the updated users data
                    Axios.get('http://localhost:8080/new-friends', { withCredentials: true })
                        .then((response) => {
                            if (response.data) {
                                const updatedUsers = response.data.users;
                                setallUsers(updatedUsers);
                            }
                        })
                        .catch((error) => {
                            console.error("Failed to fetch updated users data:", error);
                        });
                }
            })
            .catch((error) => {
                console.error("Failed to delete friend:", error);
            });
    };
    
    // Function to handle adding a friend
    const addFriend = (userId) => {
        // add the user with userId as a friend
        Axios.post(`http://localhost:8080/add-friend/${userId}`, {}, { withCredentials: true })
            .then((response) => {
                // Update the friends list or new friends list on successful addition
                if (response.data.success) {
                    // Remove the user from the new friends list
                    const updatedUsers = users.filter(user => user.user_id !== userId);
                    setallUsers(updatedUsers);
    
                    // Fetch and log the updated friends data
                    Axios.get('http://localhost:8080/friends', { withCredentials: true })
                        .then((response) => {
                            if (response.data) {
                                const updatedFriends = response.data;
                                // console.log("Updated Friends Data:", updatedFriends);
                                setFriends(updatedFriends);
                            }
                        })
                        .catch((error) => {
                            console.error("Failed to fetch updated friends data:", error);
                        });
                }
            })
            .catch((error) => {
                console.error("Failed to add friend:", error);
            });
    };
    
   
    

    if (friends.length > 0) {
        return (

            <Box
                sx={{
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    justifyContent: 'center',
                }}
            >
                <div className="manage-friends-wrapper">
                    <div className="manage-friends-container">
                        <div className="manage-friends-right-cont">
                                <div className="left-friends-wrapper">
                                    <h4 className='manage-friends-tittle'>My Friends</h4>
                                    <ul className="my-friends-container">
                                        {friends.map((friend) => (
                                            <li key={friend.user_id} className="manage-friends-items">
                                                <Link to="/Home" id="home-dev">
                                                    <Button sx={{ color: 'text.primary', gap: '10px', textTransform: 'capitalize' }}>
                                                        <img className="fr-icon" src={require(`../img/${friend.icon}`)} alt="icon" />
                                                        <div className="fr-name">{friend.name}</div>
                                                    </Button>
                                                </Link>
                                                <div className="action-button">
                                                    <Button sx={{ color: 'text.primary', gap: '10px', textTransform: 'capitalize' }} onClick={() => deleteFriend(friend.user_id)} >
                                                        <p>Delete</p>
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <nav className="right-friends-wrapper">
                                    <h4 className='manage-friends-tittle'>Add new Friends</h4>
                                    <ul className="new-friends-container">
                                        {users.map((user) => (
                                            <li key={user.user_id} className="manage-friends-items">
                                                <Link to="/Home" id="home-dev" className='grp-items'>
                                                    <Button sx={{ color: 'text.primary', gap: '10px', textTransform: 'capitalize' }}>
                                                        <img className="fr-icon" src={require(`../img/${user.icon}`)} alt="icon" />
                                                        <div className="fr-name">{user.name}</div>
                                                    </Button>
                                                </Link>
                                                <div className="action-button">
                                                    <Button sx={{ color: 'text.primary', gap: '10px', textTransform: 'capitalize' }}  onClick={() => addFriend(user.user_id)} >
                                                        <p>Add</p>
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                        </div>
                    </div>
                </div>
            </Box>
        );
    } else {
        return (
            <div>
                <nav className="right-friends-wrapper">
                                    <h4 className='manage-friends-tittle'>Add new Friends</h4>
                                    <ul className="new-friends-container">
                                        {users.map((user) => (
                                            <li key={user.user_id} className="manage-friends-items">
                                                <Link to="/Home" id="home-dev" className='grp-items'>
                                                    <Button sx={{ color: 'text.primary', gap: '10px', textTransform: 'capitalize' }}>
                                                        <img className="fr-icon" src={require(`../img/${user.icon}`)} alt="icon" />
                                                        <div className="fr-name">{user.name}</div>
                                                    </Button>
                                                </Link>
                                                <div className="action-button">
                                                    <Button sx={{ color: 'text.primary', gap: '10px', textTransform: 'capitalize' }}  onClick={() => addFriend(user.user_id)} >
                                                        <p>Add</p>
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
            </div>
        );
    }
}
