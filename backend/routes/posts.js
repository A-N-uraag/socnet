// const express = require('express');
// const router = express();
const admin = require('../utils/admin');
const db = admin.db;
exports.getAllPosts = (req, res) => {
    const postsRef = db.collection('posts');
    postsRef.get()
        .then(snapshot => {
            const posts = [];
            snapshot.forEach(doc => {
                posts.push({
                    createdDate: doc.data().createdDate,
                    content: doc.data().content,
                    likes: doc.data().likes,
                    comments: doc.data().comments,
                    reposts: doc.data().reposts,
                    noOfReports: doc.data().noOfReports
                });
            });
            return res.json(posts);
        })
        .catch(err => console.error(err));
};

exports.post = (req, res) => {
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
};

exports.getPost = (req, res) => {
    let postContent = {};
    const postId = req.params.pid;
    const posRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            postContent = doc.data();
            return res.json(postContent);
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};

exports.likePost = (req, res) => {
    const postId = req.params.pid;
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const postData = doc.data();
            postData.likes++;
            postRef.update(postData).then(() => {
                return res.json({
                    message: 'post liked successfully'
                });
            });
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};

exports.unlikePost = (req, res) => {
    const postId = req.params.pid;
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const postData = doc.data();
            if(postData.likes > 0)
            postData.likes--;
            else{
                return res.json({
                    message: 'cant unlike post'
                });
            }
            postRef.update(postData).then(() => {
                return res.json({
                    message: 'post unliked successfully'
                });
            });
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};


exports.commentPost = (req, res) => {
    const postId = req.params.pid;
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const postData = doc.data();
            postData.comments.push(req.body.comment);
            postRef.update(postData).then(() => {
                return res.json({
                    message: 'comment posted successfully'
                });
            });
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};

exports.deletePost = (req, res) => {
    const postId = req.params.pid;
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            postRef.delete().then(() => {
                return res.json({
                    message: 'post deleted successfully'
                });
            });
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};

exports.repostPost = (req, res) => {
    const postId = req.params.pid;
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const postData = doc.data();
            postData.reposts++;
            postRef.update(postData).then(() => {
                return res.json({
                    message: 'post reposted successfully'
                });
            });
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};

exports.reportPost = (req, res) => {
    const postId = req.params.pid;
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            const postData = doc.data();
            postData.noOfReports++;
            postRef.update(postData).then(() => {
                return res.json({
                    message: 'post reported successfully'
                });
            });
        } else {
            return res.status(404).json({ error: 'post not found' });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({error: err.code});
    });
};
