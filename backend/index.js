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


app.post('/follow', (req, res) => {
    const userId = req.body.email;
    const followeeId = req.body.followeeId;
    const userRef = db.collection('users').doc(userId);
    const followeeRef = db.collection('users').doc(followeeId);
    let repstring = "";
    userRef.get().then((doc) => {
        if (doc.exists) {
            userRef.update({
                following: admin.admin.firestore.FieldValue.arrayUnion(followeeId)
            }).then(() => {
                repstring += `user ${userId} followed ${followeeId}\n`;
                // res.json({
                //     message: `user ${userId} followed ${followeeId}`
                // });
            }).catch((err) => {
                res.status(500).json({ error: err });
            });
        } else {
            res.status(404).json({ error: 'current user not found' });
        }
    });
    followeeRef.get().then((doc) => {
        if (doc.exists) {
            followeeRef.update({
                followers: admin.admin.firestore.FieldValue.arrayUnion(userId)
            }).then(() => {
                repstring += `user ${followeeId} followed by ${userId}\n`;
                // res.json({
                //     message: `user ${followeeId} is followed by${userId}`
                // });
                res.json({
                    message: repstring
                });
            }).catch((err) => {
                res.status(500).json({ error: err });
            });
        } else {
            res.status(404).json({ error: 'user not found' });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});



app.post('/unfollow', (req, res) => {
    const userId = req.body.email;
    const followeeId = req.body.followeeId;
    const userRef = db.collection('users').doc(userId);
    const followeeRef = db.collection('users').doc(followeeId);
    let repstring = "";
    userRef.get().then((doc) => {
        if (doc.exists) {
            userRef.update({
                following: admin.admin.firestore.FieldValue.arrayRemove(followeeId)
            }).then(() => {
                repstring += `user ${userId} unfollowed ${followeeId}\n`;
                // res.json({
                //     message: `user ${userId} unfollowed ${followeeId}`
                // });
            }).catch((err) => {
                res.status(500).json({ error: err });
            });
        } else {
            res.status(404).json({ error: 'followee not found' });
        }
    });
    followeeRef.get().then((doc) => {
        if (doc.exists) {
            followeeRef.update({
                followers: admin.admin.firestore.FieldValue.arrayRemove(userId)
            }).then(() => {
                repstring += `user ${followeeId} unfollowed by ${userId}\n`;
                // res.json({
                //     message: `user ${followeeId} is unfollowed by ${userId}`
                // });
                res.json({ message: repstring });
            }).catch((err) => {
                res.status(500).json({ error: err });
            });
        } else {
            res.status(404).json({ error: 'user not found' });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

app.post('/createPost', (req, res) => {
    console.log(req.body);
    const newPost = {
        content: req.body.content || '',
        createdDate: new Date().toISOString(),
        likes: 0,
        comments: [],
        reposts: 0,
        noOfReports: 0,
        postedBy: req.body.email || ''
    };
    var docId;
    db.collection('posts').add(newPost)
    .then((docu) => {
        docId = docu.id;
        return db.collection('users').doc(req.body.email).update({
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

app.get('/getPosts', async (req, res) => {
    const idList = req.body.idList || [];
    posts = {};
    await Promise.all(idList.map(async (id) => {

        const post = await db.collection('posts').doc(id).get();
        posts[id] = post.data();
    }));
    res.json(posts);
});

app.post('/likePost', (req, res) => {
    const postId = req.body.postId;
    db.collection('posts').doc(postId).update({
        likes: admin.admin.firestore.FieldValue.increment(1)
    }).then(() => {
        res.json({
            message: `post ${postId} liked`
        });
    });
});

app.post('/unlikePost', (req, res) => {
    const postId = req.body.postId;
    db.collection('posts').doc(postId).update({
        likes: admin.admin.firestore.FieldValue.increment(-1)
    }).then(() => {
        res.json({
            message: `post ${postId} unliked`
        });
    });
});

app.post('/followUser', (req, res) => {
    const userId = req.body.userId;
    const followerId = req.body.followerId;
    db.collection('users').doc(userId).update({
        followers: admin.admin.firestore.FieldValue.arrayUnion(followerId)
    }).then(() => {
        db.collection('users').doc(followerId).update({
            following: admin.admin.firestore.FieldValue.arrayUnion(userId)
        }).then(() => {
            res.json({
                message: `user ${userId} followed`
            });
        });
    });
});

app.post('/unfollowUser', (req, res) => {
    const userId = req.body.userId;
    const followerId = req.body.followerId;
    db.collection('users').doc(userId).update({
        followers: admin.admin.firestore.FieldValue.arrayRemove(followerId)
    }).then(() => {
        db.collection('users').doc(followerId).update({
            following: admin.admin.firestore.FieldValue.arrayRemove(userId)
        }).then(() => {
            res.json({
                message: `user ${userId} unfollowed`
            });
        });
    });
});

app.post('/generateFeed', (req, res) => {
    const userId = req.body.userId;
    db.collection('users').doc(userId).get().then((doc) => {
        const following = doc.data().following;
        return db.collection('posts').where('postedBy', 'in', following).orderBy('createdDate', 'desc').limit(30).get();
    }).then((querySnapshot) => {
        const posts = {};
        querySnapshot.forEach((doc) => {
            posts[doc.id] = doc.data();
        });
        res.json(posts);
    });
});


// app.post('/commentPost', (req, res) => {
//     const postId = req.body.postId;
//     const postRef = db.collection('posts').doc(postId);
//     postRef.get()
//         .then((doc) => {
//             if(doc.exists){
//                 const postData = doc.data();
//                 postData.comments.push(req.body.comment);
//                 postRef.update(postData).then(() => {
//                     return res.json({
//                         message: `comment added successfully`
//                     });
//                 });
//             }
//             else{
//                 res.status(404).json({error: 'post not found'});
//             }
//         });
// });

// app.post('/repostPost', (req, res) => {
//     const postId = req.body.postId;
//     const postRef = db.collection('posts').doc(postId);
//     postRef.get()
//         .then((doc) => {
//             if(doc.exists){
//                 const postData = doc.data();
//                 postData.reposts++;
//                 postRef.update(postData).then(() => {
//                     return res.json({
//                         message: `post ${postId} reposted successfully`
//                     });
//                 });
//             }
//             else{
//                 res.status(404).json({error: 'post not found'});
//             }
//         });
// });

// app.post('/reportPost', (req, res) => {
//     const postId = req.body.postId;
//     const postRef = db.collection('posts').doc(postId);
//     postRef.get()
//         .then((doc) => {
//             if(doc.exists){
//                 const postData = doc.data();
//                 postData.noOfReports++;
//                 postRef.update(postData).then(() => {
//                     return res.json({
//                         message: `post ${postId} reported successfully`
//                     });
//                 });
//             }
//             else{
//                 res.status(404).json({error: 'post not found'});
//             }
//         });
// });

// app.delete('/deletePost', (req, res) => {
//     const postId = req.body.postId;
//     const postRef = db.collection('posts').doc(postId);
//     postRef.get()
//         .then((doc) => {
//             if(doc.exists){
//                 const postData = doc.data();
//                 postRef.delete().then(() => {
//                     return res.json({
//                         message: `post ${postId} deleted successfully`
//                     });
//                 });
//             }
//             else{
//                 res.status(404).json({error: 'post not found'});
//             }
//         });
// });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
