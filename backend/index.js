const express = require('express');
const bodyParser = require('body-parser');
const postsHandler = require('./routes/posts.js')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/posts', postsHandler.getAllPosts);
app.post('/post', postsHandler.postContent);
app.get('/post/:pid', postsHandler.getPost);
app.post('/post/:pid/like', postsHandler.likePost);
app.post('/post/:pid/unlike', postsHandler.unlikePost);
app.post('/post/:pid/comment', postsHandler.commentPost);
app.post('/post/:pid/repost', postHandler.repostPost);
app.post('/post/:pid/report', postHandler.reportPost);
app.delete('/post/:pid', postHandler.deletePost);



const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
