const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('./utils/admin');
const db = admin.db;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const {postContent, getPost, likePost, unlikePost, commentPost, repostPost, reportPost, deletePost, getAllPosts} = require('./routes/posts');

app.post('/post', (req, res) => {
    const newPost = {
        content: req.body.content,
        createdDate: new Date().toISOString(),
        likes: 0,
        comments: [],
        reposts: 0,
        noOfReports: 0
    };

    db.collection('posts').add(newPost).then((doc) => {
        res.json({
            message: `document ${doc.id} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: 'error while creating post' });
    });
});
// app.get('/post/:pid', postsHandler.getPost);
// app.post('/post/:pid/like', postsHandler.likePost);
// app.post('/post/:pid/unlike', postsHandler.unlikePost);
// app.post('/post/:pid/comment', postsHandler.commentPost);
// app.post('/post/:pid/repost', postHandler.repostPost);
// app.post('/post/:pid/report', postHandler.reportPost);
// app.delete('/post/:pid/delete', postHandler.deletePost);

app.post('/', (req, res) => {
    console.log(req.body);
    const newProfile = {
        uname: req.body.uname || '',
        dob: req.body.dob || '',
        bio: req.body.bio || '',
        website: req.body.website || '',
        location: req.body.location || '',
        posts: [],
        likedPosts: [],
        followers: [],
        following: []
    };
    db.collection('users').doc(req.body.email).set(newProfile).then((doc) => {
        res.json({
            message: `document ${doc.id} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: 'error while creating profile' });
    });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
