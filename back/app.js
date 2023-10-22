import mysql from 'mysql2'
import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const oneDayMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const nextDay = new Date(Date.now() + oneDayMilliseconds);

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

app.use(session({
    key: "userId",
    secret: "this_is_a_secret_session",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: nextDay,
    },
}));

app.get("/profile", (req, res) => {
    // console.log(req.session.user);
    if (req.session.user) {
        const userData = req.session.user;
        res.send({ userData });
    } else {
        res.send({ message: "User not logged in" });
    }
});

// Remove friend
app.delete('/delete-friend/:friendId', (req, res) => {
    console.log(req.session.user);
    if (req.session.user) {
        const userId = req.session.user[0].user_id;
        const friendId = parseInt(req.params.friendId);

        // Check if the user has a friendship with the friend to be deleted
        db.query(
            "DELETE FROM friendships WHERE user_id = ? AND friend_id = ?",
            [userId, friendId],
            (err, result) => {
                if (err) {
                    res.status(500).send({ err: err });
                } else {
                    if (result.affectedRows > 0) {
                        res.json({ success: true });
                    } else {
                        res.status(404).send({ message: "Friend not found" });
                    }
                }
            }
        );
    } else {
        res.status(401).send({ message: "User not logged in" });
    }
});

// Add friend
app.post('/add-friend/:userId', (req, res) => {
    if (req.session.user) {
        const userId = req.session.user[0].user_id;
        const friendId = parseInt(req.params.userId);

        // Check if the user is trying to add themselves as a friend
        if (userId === friendId) {
            return res.send({ message: "Cannot add yourself as a friend" }); //.status(400)
        }

        // Check if the user is already friends with the specified user
        db.query(
            "SELECT * FROM friendships WHERE user_id = ? AND friend_id = ?",
            [userId, friendId],
            (err, result) => {
                if (err) {
                    res.status(500).send({ err: err });
                } else {
                    if (result.length > 0) {
                        res.send({ message: "User is already a friend" }); //.status(400)
                    } else {
                        // Create a new friendship between the user and the specified friend
                        db.query(
                            "INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)",
                            [userId, friendId],
                            (err, insertResult) => {
                                if (err) {
                                    res.send({ err: err }); //.status(500)
                                } else {
                                    res.json({ success: true });
                                }
                            }
                        );
                    }
                }
            }
        );
    } else {
        res.send({ message: "User not logged in" }); //.status(401)
    }
});

// Show users that are not friends and without the logged in user
app.get("/new-friends", (req, res) => {
    if (req.session.user) {
        const userData = req.session.user;
        const user_id = userData[0].user_id;

        db.query(
            "SELECT friend_id FROM friendships WHERE user_id = ?",
            user_id,
            (err, result) => {
                if (err) {
                    res.send({ err: err });
                } else {
                    const friendIds = result.map(friend => friend.friend_id);
                    friendIds.push(user_id); // Include the logged-in user's ID

                    // Query for all users except the logged-in user and their friends
                    db.query(
                        "SELECT * FROM user_accs WHERE user_id NOT IN (?)",
                        [friendIds],
                        (err, usersResult) => {
                            if (err) {
                                res.send({ err: err });
                            } else {
                                res.send({ users: usersResult });
                            }
                        }
                    );
                }
            }
        );
    } else {
        res.send({ message: "User not logged in" });
    }
});



app.get("/friends", (req, res) => {
    if (req.session.user) {
        const userData = req.session.user;
        const user_id = userData[0].user_id;
        db.query(
            "SELECT friend_id FROM friendships WHERE user_id = ?",
            user_id,
            (err, result) => {
                if (err) {
                    // Send an error response if there's an error
                    res.send({ err: err });
                } else {
                    if (result.length > 0) {
                        const friendsDataArray = [];

                        // Loop through each friend to fetch their data
                        result.forEach((friend, index) => {
                            db.query(
                                "SELECT * FROM user_accs WHERE user_id = ?",
                                friend.friend_id,
                                (err, friendResult) => {
                                    if (err) {
                                        // Send an error response if there's an error
                                        res.send({ err: err });
                                    } else {
                                        if (friendResult.length > 0) {
                                            // Add the friend's data to the friendsDataArray
                                            friendsDataArray.push(friendResult[0]);
                                        }

                                        // Check if all queries are finished
                                        if (index === result.length - 1) {
                                            // Send the array as the response
                                            // console.log(friendsDataArray); // [ { user_id: 2, username: '...', password: '...', email: '...', name: '...', icon: '...' } ... { user_id: 2, username: '...', password: '...', email: '...', name: '...', icon: '...' } ]
                                            res.send(friendsDataArray);
                                        }
                                    }
                                }
                            );
                        });
                    } else {
                        // Send a message if no friends are found
                        res.send({ message: "Friends not found" });
                    }
                }
            }
        );
    } else {
        // Send a message if the user is not logged in
        res.send({ message: "User not logged in" });
    }
});

app.get("/posts", (req, res) => {
    db.query(
        "SELECT p.*, u.*, c.comment_text, c.user_id AS comment_user_id, cu.name AS comment_author_name, cu.icon AS comment_author_icon FROM posts p " +
        "JOIN user_accs u ON p.user_id = u.user_id " +
        "LEFT JOIN comments c ON p.post_id = c.post_id " +
        "LEFT JOIN user_accs cu ON c.user_id = cu.user_id",
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                const responseData = {
                    posts: result, // This will contain both posts, user data, comments, comment user_id, comment author name, and comment author icon
                };
                res.send(responseData);
            }
        }
    );
});
// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = '../front/src/img'; // Folder where uploaded images will be saved
        console.log('Destination Path:', destinationPath); // Log the destination path
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        // Use the original filename as the stored filename
        const filename = file.originalname;
        console.log('File is an image:', filename);
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

app.post('/create-post', upload.single('post_icon'), (req, res) => {
    const { user_id, post_title, post_likes } = req.body;
    const post_icon = req.file; // Extract the uploaded file

    // console.log("Received User ID:", user_id);
    // console.log("Received Post Title:", post_title);
    // console.log("Received Post Icon :", post_icon.filename); // Access the uploaded filename from the File object
    // console.log("Received Post Likes:", post_likes);

    if (!user_id || !post_title || !post_icon.filename || post_likes === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    db.query(
        'INSERT INTO posts (user_id, post_title, post_icon, post_likes) VALUES (?, ?, ?, ?)',
        [user_id, post_title, post_icon.filename, post_likes], // Store only the filename
        (err, result) => {
            if (err) {
                console.error("Error inserting into the database:", err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            console.log("Post created successfully");
            res.status(201).json({ message: 'Post created successfully' });
        });
});


app.post('/register', upload.single('profilePicture'), (req, res) => {
    const { username, password, name } = req.body;

    // Check if any required fields are missing
    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if a profile picture was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Profile picture is required' });
    }

    // Get the file name of the uploaded profile picture
    const profilePictureFileName = req.file.filename;

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Password hashing failed' });
        }

        // Insert the new user into the database, including the profile picture file name
        db.query(
            'INSERT INTO user_accs (username, password, name, icon) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, name, profilePictureFileName],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'User registration failed' });
                }
                return res.status(201).json({ message: 'User registered successfully' });
            }
        );
    });
});




app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM user_accs WHERE username = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                if (result.length > 0) {
                    const storedHash = result[0].password;
                    bcrypt.compare(password, storedHash, (error, response) => {
                        if (response) {
                            req.session.user = result;
                            res.send(result);
                        } else {
                            res.send({ message: "Wrong username/password" });
                        }
                    });
                } else {
                    res.send({ message: "User not found" });
                }
            }
        }
    );
});

app.post("/logout", (req, res) => {

    if (req.session.user || req.session.user===undefined) {
        req.session.destroy((err) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ message: "Logout successful" });
            }
        });
    } else {
        res.send({ message: "You are not logged in" });
    }
});


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})
