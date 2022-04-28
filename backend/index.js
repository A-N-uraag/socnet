const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('./utils/admin');
const db = admin.db;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/createUser', (req, res) => {
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
            message: `user ${req.body.email} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});


// app.post('/follow', (req, res) => {
//     const userId = req.body.email;
//     const followeeId = req.body.followeeId;
//     const userRef = db.collection('users').doc(userId);
//     const followeeRef = db.collection('users').doc(followeeId);
//     userRef.get().then((doc) => {
//         if (doc.exists) {
//             userRef.update({
//                 following: admin.admin.firestore.FieldValue.arrayUnion(followeeId)
//             }).then(() => {
//                 res.json({
//                     message: `user ${userId} followed ${followeeId}`
//                 });
//             }).catch((err) => {
//                 res.status(500).json({ error: err });
//             });
//         } else {
//             res.status(404).json({ error: 'followee not found' });
//         }
//     });
//     followeeRef.get().then((doc) => {
//         if (doc.exists) {
//             followeeRef.update({
//                 followers: admin.admin.firestore.FieldValue.arrayUnion(userId)
//             }).then(() => {
//                 res.json({
//                     message: `user ${followeeId} is followed by${userId}`
//                 });
//             }).catch((err) => {
//                 res.status(500).json({ error: err });
//             });
//         } else {
//             res.status(404).json({ error: 'user not found' });
//         }
//     })
//     .catch((err) => {
//         res.status(500).json({ error: err });
//     });
// });



// app.post('/unfollow', (req, res) => {
//     const userId = req.body.email;
//     const followeeId = req.body.followeeId;
//     const userRef = db.collection('users').doc(userId);
//     const followeeRef = db.collection('users').doc(followeeId);
//     userRef.get().then((doc) => {
//         if (doc.exists) {
//             userRef.update({
//                 following: admin.admin.firestore.FieldValue.arrayRemove(followeeId)
//             }).then(() => {
//                 res.json({
//                     message: `user ${userId} unfollowed ${followeeId}`
//                 });
//             }).catch((err) => {
//                 res.status(500).json({ error: err });
//             });
//         } else {
//             res.status(404).json({ error: 'followee not found' });
//         }
//     });
//     followeeRef.get().then((doc) => {
//         if (doc.exists) {
//             followeeRef.update({
//                 followers: admin.admin.firestore.FieldValue.arrayRemove(userId)
//             }).then(() => {
//                 res.json({
//                     message: `user ${followeeId} is unfollowed by ${userId}`
//                 });
//             }).catch((err) => {
//                 res.status(500).json({ error: err });
//             });
//         } else {
//             res.status(404).json({ error: 'user not found' });
//         }
//     })
//     .catch((err) => {
//         res.status(500).json({ error: err });
//     });
// });

app.post('/createPost', (req, res) => {
    console.log(req.body);
    const newPost = {
        content: req.body.content || '',
        createdDate: new Date().toISOString(),
        likes: 0,
        comments: [],
        reposts: 0,
        noOfReports: 0,
        postedBy: req.body.user || ''
    };
    var docId;
    db.collection('posts').add(newPost)
    .then((docu) => {
        docId = docu.id;
        return db.collection('users').doc(req.body.user).update({
            posts: admin.admin.firestore.FieldValue.arrayUnion(docu.id)
        });
    })
    .then((res) => {
        return {res:res,doc:docId};
    })
    .then((resp)=>{
        res.json(resp);
    });
});

app.get('/getAllPosts', (req, res) => {
    db.collection('posts').get()
        .then((snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
                posts.push(doc.data());
            });
            res.json(posts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
});

app.get('/getPost', (req, res) => {
    const postId = req.body.postId;
    const postRef = db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                res.json(doc.data());
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
});

app.post('/likePost', (req, res) => {
    const postId = req.body.postId;
    const postRef =db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                const postData = doc.data();
                postData.likes++;
                postRef.update(postData).then(() => {
                    return res.json({
                        message: `post ${postId} liked successfully`
                    });
                });
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        })
});

app.post('/unlikePost', (req, res) => {
    const postId = req.body.postId;
    const postRef = db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                const postData = doc.data();
                if(postData.likes > 0)
                postData.likes--;
                else{
                    return res.json({
                        message: 'cant unlike post with no likes'
                    });
                }
                postRef.update(postData).then(() => {
                    return res.json({
                        message: `post ${postId} unliked successfully`
                    });
                });
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        });
});

app.post('/commentPost', (req, res) => {
    const postId = req.body.postId;
    const postRef = db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                const postData = doc.data();
                postData.comments.push(req.body.comment);
                postRef.update(postData).then(() => {
                    return res.json({
                        message: `comment added successfully`
                    });
                });
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        });
});

app.post('/repostPost', (req, res) => {
    const postId = req.body.postId;
    const postRef = db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                const postData = doc.data();
                postData.reposts++;
                postRef.update(postData).then(() => {
                    return res.json({
                        message: `post ${postId} reposted successfully`
                    });
                });
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        });
});

app.post('/reportPost', (req, res) => {
    const postId = req.body.postId;
    const postRef = db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                const postData = doc.data();
                postData.noOfReports++;
                postRef.update(postData).then(() => {
                    return res.json({
                        message: `post ${postId} reported successfully`
                    });
                });
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        });
});

app.delete('/deletePost', (req, res) => {
    const postId = req.body.postId;
    const postRef = db.collection('posts').doc(postId);
    postRef.get()
        .then((doc) => {
            if(doc.exists){
                const postData = doc.data();
                postRef.delete().then(() => {
                    return res.json({
                        message: `post ${postId} deleted successfully`
                    });
                });
            }
            else{
                res.status(404).json({error: 'post not found'});
            }
        });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
