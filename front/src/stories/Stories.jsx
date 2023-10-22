import React, { useState, useEffect } from "react";
import './stories.scss'
import Axios from 'axios';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ManageFriends from "../manage-friends/ManageFriends";

export default function Stories() {

  const [posts, setPosts] = useState([]);
  const [showAllComments, setShowAllComments] = useState([]);
  const [isCreatePostPopupOpen, setCreatePostPopupOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState(""); // State to store user ID
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false); // Dialog state
  
  useEffect(() => {
    // Fetch user ID here and set it in the state
    Axios.get('http://localhost:8080/profile', { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.userData && response.data.userData[0].user_id) {
          setUserId(response.data.userData[0].user_id);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user ID:", error);
      });

    Axios.get('http://localhost:8080/posts', { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.posts) {
          // Group posts by post_id
          const postsMap = new Map();
          response.data.posts.forEach((post) => {
            if (!postsMap.has(post.post_id)) {
              postsMap.set(post.post_id, {
                ...post,
                comments: [],
              });
            }
            if (post.comment_text) {
              postsMap.get(post.post_id).comments.push({
                commentText: post.comment_text,
                commentAuthorName: post.comment_author_name,
                commentAuthorIcon: post.comment_author_icon,
              });
            }
          });

          // Convert the map back to an array of posts
          const groupedPosts = [...postsMap.values()];

          // Initialize showAllComments state for each post
          const initialShowAllComments = Array(groupedPosts.length).fill(false);
          setShowAllComments(initialShowAllComments);

          setPosts(groupedPosts);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch post data:", error);
      });
  }, []);

  const openCreatePostPopup = () => {
    setCreatePostPopupOpen(true);
  };

  // Function to close the "Create Post" popup
  const closeCreatePostPopup = () => {
    setCreatePostPopupOpen(false);
  };

  // Function to handle file input change for image upload
  const handleImageInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file)); // Update image preview
  };

  const createPost = () => {
    // Ensure that the user ID is available
    if (!userId) {
      console.error("User ID is missing. Cannot create a post.");
      return;
    }

    // Create a FormData object to send the data
    const formData = new FormData();
    formData.append("user_id", userId); // Use the stored user ID
    formData.append("post_title", postTitle);
    formData.append("post_icon", selectedImage);
    formData.append("post_likes", 0); // Set post_likes to 0

    // Log the formData to check if it's correctly populated
    console.log("FormData:", formData);

    // Perform the POST request using Axios
    Axios.post('http://localhost:8080/create-post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type for form data
      },
    })
      .then((response) => {
        // Handle the response if needed
        const message = response.data.message;
        setSuccessMessage(message); // Set the success message
        setSuccessDialogOpen(true);
        // Close the dialog
        closeCreatePostPopup();
      })
      .catch((error) => {
        // Handle errors
        console.error("Failed to create post:", error);
      });
  };

  // Function to toggle comments for a post
  const toggleComments = (postIndex) => {
    // Create a copy of the showAllComments array
    const updatedShowAllComments = [...showAllComments];
    // Toggle the state for the specified post
    updatedShowAllComments[postIndex] = !updatedShowAllComments[postIndex];
    // Update the state
    setShowAllComments(updatedShowAllComments);
  };

  return (
    <Box>
      <div className="stories-container">
        <div className="stories-container-left">
          <div className="stor-create-btn">
            <Button onClick={openCreatePostPopup} sx={{ minWidth: "100%", color: 'text.primary', textTransform: 'capitalize' }}>
              Create Post
            </Button>
          </div>
          {/* Dialog for Success Message */}
          <Dialog
            open={isSuccessDialogOpen}
            onClose={() => setSuccessDialogOpen(false)}
            aria-labelledby="success-dialog"
          >
            <DialogTitle>Success</DialogTitle>
            <DialogContent>
              <p>{successMessage}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSuccessDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for Create New Post */}
          <Dialog
            open={isCreatePostPopupOpen}
            onClose={closeCreatePostPopup}
            aria-labelledby="create-post-dialog"

          >
            <DialogTitle >Create a New Post</DialogTitle>
            <DialogContent

            >
              <div className="create-post-form">
                <TextField
                  label="Title"
                  fullWidth
                  variant="outlined"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload-input"
                  type="file"
                  onChange={handleImageInputChange}
                />
                {/* Display image preview */}
                {imagePreview && (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                    <p>{selectedImage.name}</p> {/* Display the file name */}
                  </div>
                )}
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
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeCreatePostPopup}>Cancel</Button>
              <Button onClick={createPost} variant="contained" color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>

          {posts.map((post, index) => (
            <nav className="stor-li-wrapper" key={post.post_id}>
              <ul className="stor-li-container" >
                <li className="stor-items"  >
                  {/* console.log("Icon Path:", post.icon);  */}

                  <img className="stor-icon" src={require(`../img/${post.icon}`)} alt="icon" />
                  <div className="stor-name">{post.name}</div>
                </li>
                <div className="user-title-display">
                  {post.post_title}
                </div>
                <img className="post-image-display" src={require(`../img/${post.post_icon}`)} alt="icon" />
                <div className="post-like-btn" >
                  <FavoriteBorderIcon sx={{ color: 'text.primary', cursor: 'pointer' }} />
                  <p className="post-like-counter">{post.post_likes}</p>
                </div>
                <div className="post-comment-section">
                  {post.comments.length > 0 ? (
                    showAllComments[index] ? (
                      // Render all comments if showAllComments is true
                      post.comments.map((comment, commentIndex) => (
                        <div className="post-comm-wrap" key={commentIndex}>
                          <img className="post-comment-icon" src={require(`../img/${comment.commentAuthorIcon}`)} alt="icon" />
                          <div className="post-comment-username-comment">
                            <h4 className="username-text">{comment.commentAuthorName}</h4>
                            <p className="comment-text">{comment.commentText}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Render only the first comment if showAllComments is false
                      <div className="post-comm-wrap">
                        <img className="post-comment-icon" src={require(`../img/${post.comments[0].commentAuthorIcon}`)} alt="icon" />
                        <div className="post-comment-username-comment">
                          <h4 className="username-text">{post.comments[0].commentAuthorName}</h4>
                          <p className="comment-text">{post.comments[0].commentText}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <p>No comments</p>
                  )}
                </div>
                {/* Show More Comments button */}
                {post.comments.length > 1 && (
                  <Button onClick={() => toggleComments(index)} sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
                    {showAllComments[index] ? "Show Less Comments" : "Show All Comments"}
                  </Button>
                )}
              </ul>
            </nav>
          ))}
        </div>
        <div className="stories-container-right">
          <ManageFriends className="stories-manage-friends-container" />
        </div>
      </div>
    </Box>
  );
}