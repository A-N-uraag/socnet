const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('./utils/admin');
const db = admin.db;
const app = express();
const uploadImage = require('./utils/helper')
const multer = require('multer')

const multerFiles = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
});

app.use(cors());
app.use(bodyParser.json());


app.post('/upload', multerFiles.single('file'), async (req, res) => {
    try {
        const nullObj = {value: "null"};
        const nullBlob = new Blob([JSON.stringify(nullObj, null, 2)], {type : 'application/json'});
        var imageUrl = "null";
        if(req.file === nullBlob)
            imageUrl = await uploadImage(req.file);
        res.status(200)
        .json({
            "message": "Upload was successful",
            "url": imageUrl
        })
    }
    catch (error) {
        res.json({"error":error});
    }
});

app.post('/createUser', (req, res) => {
    const newProfile = {
        uname: req.body.uname || '',
        dob: req.body.dob || '',
        createdDate: new Date().toISOString(),
        bio: req.body.bio || '',
        website: req.body.website || '',
        location: req.body.location || 'Oasis',
        posts: [],
        likedPosts: [],
        followers: [],
        following: []
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        "Api-Token": "f8e1ab3d0959c1f9c3483bd777a4d1ef0d920e92",
        body: JSON.stringify({
            "user_id": req.body.email,
            "nickname": req.body.uname,
            "profile_url": "https://avatars.dicebear.com/api/bottts/"+req.body.email+".svg?colorful=1",
        })
    }
    db.collection('users').doc(req.body.email).set(newProfile).then((doc) => {
        res.json({
            "message": `user ${req.body.email} created successfully`
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

app.post('/getUnames', async (req, res) => {
    const userIds = req.body.userIds || [];
    resp = {};
    await Promise.all(userIds.map(async (userId) => {

        const user = await db.collection('users').doc(userId).get();
        resp[userId] = user.data().uname;
    }));
    res.json(resp);
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
            postedByName: userName || '',
            media: req.body.media || 'null'
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
        if(!doc.exists){
            res.status(404).json({ "error": 'user does not exist' });
        }
        res.json(doc.data());
    });
});

app.post('/generateFeed', (req, res) => {
    const userId = req.body.userId;
    db.collection('users').doc(userId).get().then((doc) => {
        if(doc.exists) {
            const following = doc.data().following;
            if(following.length == 0)
                following.push(userId);
            return db.collection('posts').where('postedBy', 'in', following).orderBy('createdDate', 'desc').limit(30).get();
        }
    }).then((querySnapshot) => {
        const posts = {};
        if(!querySnapshot.empty)
        querySnapshot.forEach((doc) => {
            posts[doc.id] = doc.data();
        });
        res.json(posts);
    });
});

app.get('/getAllUsers', (req, res) => {
    db.collection('users').get().then((querySnapshot) => {
        const users = {};
        querySnapshot.forEach((doc) => {
            users[doc.id] = doc.data().uname;
        });
        res.json(users);
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
