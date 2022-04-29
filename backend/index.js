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
            "message": `user ${req.body.email} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

app.post('/createPost', (req, res) => {
    var userName;
    db.collection('users').doc(req.body.email).get()
    .then((doc) => {
        userName = doc.data().uname;
        const newPost = {
            content: req.body.content || '',
            createdDate: new Date().toISOString(),
            likes: [],
            comments: [],
            reposts: 0,
            noOfReports: 0,
            postedBy: req.body.email || '',
            postedByName: userName || ''
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
});

app.get('/getUser', (req, res) => {
    db.collection('users').doc(req.query.email).get()
    .then((doc) => {
        res.json(doc.data());
    });
});

app.post('/generateFeed', (req, res) => {
    const userId = req.body.userId;
    db.collection('users').doc(userId).get().then((doc) => {
        if(doc.exists) {
            const following = doc.data().following;
            return db.collection('posts').where('postedBy', 'in', following).orderBy('createdDate', 'desc').limit(30).get();
        }
    }).then((querySnapshot) => {
        const posts = {};
        querySnapshot.forEach((doc) => {
            posts[doc.id] = doc.data();
        });
        res.json(posts);
    });
});

app.post('/getPosts', async (req, res) => {
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
        likes: admin.admin.firestore.FieldValue.arrayUnion(req.body.email)
    }).then(() => {
        res.json({
            "message": `post ${postId} liked`
        });
    });
});

app.post('/unlikePost', (req, res) => {
    const postId = req.body.postId;
    db.collection('posts').doc(postId).update({
        likes: admin.admin.firestore.FieldValue.arrayRemove(req.body.email)
    }).then(() => {
        res.json({
            "message": `post ${postId} unliked`
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
                "message": `user ${userId} followed`
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
                "message": `user ${userId} unfollowed`
            });
        });
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
//                         "message": `comment added successfully`
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
//                         "message": `post ${postId} reposted successfully`
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
//                         "message": `post ${postId} reported successfully`
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
//                         "message": `post ${postId} deleted successfully`
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
